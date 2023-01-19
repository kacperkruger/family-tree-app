import express, {Request, Response, Router} from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {addUser, getUserDetails} from '@kacperkruger/clients/user';
import {isClientError} from '@kacperkruger/clients';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';

const router: Router = express.Router();

router.post('/login', passport.authenticate('local', {session: false}), (req: Request, res: Response): Response => {
    const token = jwt.sign({id: req.user?._id}, process.env.JWT_SECRET || '', {expiresIn: 1200});

    res.cookie('Access-Token', token, {httpOnly: true});
    return res.json({user: req.user});
});

router.get('/me', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await getUserDetails(<string>req.user?._id);
        return res.json({user});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.post('/register', async (req: Request, res: Response): Promise<Response> => {
    try {
        const addedUser = await addUser(req.body);
        return res.json({user: addedUser});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.post('/logout', (req: Request, res: Response): Response => {
    res.clearCookie('Access-Token');
    return res.sendStatus(200);
});

export default router;