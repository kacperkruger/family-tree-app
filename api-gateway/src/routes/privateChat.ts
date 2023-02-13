import express, {Request, Response, Router} from 'express';
import {
    addMessageToPrivateChat,
    addPrivateChat,
    addUserToPrivateChat,
    getPrivateChat,
    getUsersPrivateChats
} from '@kacperkruger/clients/private-chat';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';
import populatePrivateChat from '../utils/populatePrivateChat';
import {isClientError} from '@kacperkruger/clients';
import {getUsersDetails} from '@kacperkruger/clients/user';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<Response> => {
    const userId = <string>req.user?._id;
    const users = req.body.users;

    try {
        const createdPrivateChat = await addPrivateChat({users: [...users, userId]});
        const populatedChat = await populatePrivateChat(createdPrivateChat);
        return res.status(201).json({privateChat: populatedChat});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.get('/:chatId', async (req: Request, res: Response): Promise<Response> => {
    const chatId = req.params.chatId;
    try {
        const privateChat = await getPrivateChat(chatId, <string>req.user?._id);
        const populatedChat = await populatePrivateChat(privateChat);
        return res.json({privateChat: populatedChat});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.post('/:chatId/users', async (req: Request, res: Response): Promise<Response> => {
    const chatId = req.params.chatId;
    const userToAdd = req.body.userToAdd;

    try {
        const updatedChat = await addUserToPrivateChat(chatId, <string>req.user?._id, userToAdd);
        const populatedChat = await populatePrivateChat(updatedChat);
        return res.json({privateChat: populatedChat});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.post('/:chatId/messages', async (req: Request, res: Response): Promise<Response> => {
    const chatId = req.params.chatId;
    const text = req.body.text;

    const userId = <string>req.user?._id;
    try {
        let message = await addMessageToPrivateChat(chatId, {userId, text});
        const userDetails = await getUsersDetails([message.user]);
        return res.json({message: {...message, user: userDetails[0]}});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.get('/', async (req: Request<{}, {}, {}, { userId: string | string[] | undefined, username: string | undefined }>, res: Response): Promise<Response> => {
    let usersId = req.query.userId;
    const usernameToFind = req.query.username;
    const userId = <string>req.user?._id;

    if (usersId === undefined) usersId = [userId];
    if (typeof usersId === 'string') usersId = [usersId, userId];
    else usersId = usersId.concat(userId);

    try {
        const usersChats = await getUsersPrivateChats(usersId);
        const populatedUsersChats = await Promise.all(usersChats.map(async chat => await populatePrivateChat(chat)));
        if (usernameToFind) {
            const filteredChats = populatedUsersChats.filter(chat => chat.users
                .map(user => user.username)
                .some(username => username.match(usernameToFind) !== null));
            return res.json({privateChats: filteredChats});
        }
        return res.json({privateChats: populatedUsersChats});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

export default router;