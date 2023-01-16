import express, {Request, Response, Router} from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {getUserDetails} from '@kacperkruger/clients/user';
import {isClientError} from '@kacperkruger/clients';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';

const router: Router = express.Router();

router.post('/login', passport.authenticate('local', {session: false}), (req: Request, res: Response): Response => {
    const token = jwt.sign({id: req.user?._id}, process.env.JWT_SECRET || '', {expiresIn: 1200});
    return res.json({token});
});

router.get('/me', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response): Promise<Response> => {
    try {
        // @ts-ignore
        const user = await getUserDetails('123');
        return res.json({user});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});


export default router;