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

router.get('/:id/details', async (req: Request, res: Response): Promise<Response> => {
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

router.get('/:id/sensitive-data', async (req: Request, res: Response): Promise<Response> => {
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

router.get('/', async (req: Request, res: Response): Promise<Response> => {
    let usersId = req.query.id;
    if (usersId) {
        if (typeof usersId === 'string') usersId = [usersId];
        try {
            const users = await User.find({_id: {$in: usersId}}).select('--password');
            if (users.length !== usersId.length) return res.status(404).json({error: 'User(s) not found'});
            return res.json({users});
        } catch (e) {
            const errorMessage = parseErrorMessage(e);
            return res.status(400).json({error: errorMessage});
        }
    }
    const users = await User.find({}).select('--password');
    return res.json({users});
});

export default router;