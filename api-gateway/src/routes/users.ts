import express, {Request, Response} from 'express';
import {getUserDetailsByUsername, getUsersDetails} from '@kacperkruger/clients/user';
import {isClientError} from '@kacperkruger/clients';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const userId = <string>req.user?._id;
    try {
        const users = await getUsersDetails([]);
        return res.json({users: users.filter(user => user._id !== userId)});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.get('/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const user = await getUsersDetails([userId]);
        return res.json({user: user[0]});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.get('/usernames/:username', async (req: Request, res: Response) => {
    const username = req.params.username;
    try {
        const user = await getUserDetailsByUsername(username);
        return res.json({user: user});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

export default router;