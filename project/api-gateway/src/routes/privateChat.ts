import express, {Request, Response, Router} from 'express';
import {addPrivateChat, getPrivateChat} from '@kacperkruger/clients/private-chat';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';
import populatePrivateChat from '../utils/populatePrivateChat';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<Response> => {
    try {
        const createdPrivateChat = await addPrivateChat(req.body);
        const populatedChat = populatePrivateChat(createdPrivateChat);
        return res.status(201).json({privateChat: populatedChat});
    } catch (e) {
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
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

export default router;