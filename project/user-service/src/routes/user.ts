import express, {Request, Response} from 'express';
import User from '../models/UserModel';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';
import {UserRequest} from '../models/UserRequest';
import hashPassword from '../utils/hashPassword';

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<Response> => {
    const userRequest = UserRequest.check(req.body);
    userRequest.password = await hashPassword(userRequest.password);

    let user1 = await User.findOne({username: userRequest.username})
    if (user1) return res.status(400).json({error: "users exists with given username"})

    let user2 = await User.findOne({email: userRequest.email})
    if (user2) return res.status(400).json({error: "users exists with given email"})
    try {
        await User.create(userRequest);
        return res.sendStatus(204);
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.get('/:id/details', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
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
        const user = await User.findOne({username}).select('username password');
        return res.json({user});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.get('/username/:username/details', async (req: Request, res: Response): Promise<Response> => {
    const username = req.params.username;
    try {
        const user = await User.findOne({username}).select('--password');
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
            const users = await User.find({_id: {$in: usersId}});
            if (users.length !== usersId.length) return res.status(404).json({error: 'User(s) not found'});
            return res.json({users});
        } catch (e) {
            const errorMessage = parseErrorMessage(e);
            return res.status(400).json({error: errorMessage});
        }
    }
    const users = await User.find({});
    return res.json({users});
});

export default router;