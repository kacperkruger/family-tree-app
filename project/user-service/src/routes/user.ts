import express, {Request, Response} from 'express';
import User from '../models/UserModel';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';
import {UserRequest} from '../models/UserRequest';
import hashPassword from '../utils/hashPassword';

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<Response> => {
    const userRequest = UserRequest.check(req.body);
    userRequest.password = await hashPassword(userRequest.password);
    try {
        await User.create(userRequest);
        return res.status(204);
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.get('/:id/details', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId, '-__v');
        if (user === null) return res.status(404).json({error: 'User not found'});
        return res.json({user});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.get('/username/:username/sensitive-data', async (req: Request, res: Response): Promise<Response> => {
    const username = req.params.username;
    try {
        const user = await User.findOne({username}).select('-__v').select('username password');
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
            const users = await User.find({_id: {$in: usersId}}).select('-__v');
            if (users.length !== usersId.length) return res.status(404).json({error: 'User(s) not found'});
            return res.json({users});
        } catch (e) {
            const errorMessage = parseErrorMessage(e);
            return res.status(400).json({error: errorMessage});
        }
    }
    const users = await User.find({}).select('-__v');
    return res.json({users});
});

export default router;