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
        return res.status(400).send(errorMessage);
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
        return res.status(400).send(errorMessage);
    }
});

router.get('/sensitive/:id', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId, 'username password');
        if (user === null) return res.status(404).json({error: 'User not found'});
        return res.json({user});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).send(errorMessage);
    }
});

router.get('/details', async (req: Request, res: Response): Promise<Response> => {
    const userIds = req.body.userIds;
    try {
        const user = await User.find({_id: {$all: userIds}}).select('--password');
        if (user === null) return res.status(404).json({error: 'User not found'});
        return res.json({user});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(500).send(errorMessage);
    }
});

export default router;