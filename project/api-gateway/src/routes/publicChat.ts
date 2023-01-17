import express, {Request, Response} from 'express';
import {isClientError} from '@kacperkruger/clients';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';
import {addMessageToPublicChat, getMessagesFromPublicChat} from '@kacperkruger/clients/public-chat';
import populatePublicChat from '../utils/populatePublicChat';


const router = express.Router();

router.get('/messages', async (req: Request, res: Response): Promise<Response> => {
    try {
        const publicChat = await getMessagesFromPublicChat();
        const populatedChat = await populatePublicChat(publicChat);
        return res.json({publicChat: populatedChat});
    } catch (e) {
        if (isClientError(e) && e.response?.status) return res.status(e.response.status).json({error: e.response.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.post('/messages', async (req: Request, res: Response): Promise<Response> => {
    const userId = <string>req.user?._id;
    const text = req.body.text;
    try {
        const addedMessage = await addMessageToPublicChat({userId, text});
        const populatedMessage = await populatePublicChat([addedMessage]);
        return res.json({message: populatedMessage[0]});
    } catch (e) {
        if (isClientError(e) && e.response?.status) return res.status(e.response.status).json({error: e.response.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

export default router;