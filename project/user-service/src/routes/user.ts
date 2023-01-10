import express, {Request, Response} from 'express';
import User from '../models/User';
import hashPassword from '../utils/hashPassword';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<Response> => {
    const data = req.body;
    try {
        const hashedPassword = await hashPassword(data.password);
        const createdUser = await User.create({
            username: data.username,
            email: data.email,
            password: hashedPassword
        });
        return res.status(201).json({createdUser});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.get('/details/:id', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId, '--password');
        if (user === null) return res.status(404).json({error: 'User not found'});
        return res.json({user});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.get('/sensitive/:id', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId, '-_id username password');
        if (user === null) return res.status(404).json({error: 'User not found'});
        return res.json({user});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.get('/details', async (req: Request<{}, {}, {}, { userId: string }>, res: Response): Promise<Response> => {
    const userIds = req.query.userId;
    try {
        const users = await User.find({_id: {$in: userIds}}).select('--password');
        if (users.length !== userIds.length) return res.status(404).json({error: 'User(s) not found'});
        return res.json({users});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.get('/', async (_req: Request, res: Response): Promise<Response> => {
    const users = await User.find({}).select('--password');
    return res.json({users});
});

export default router;