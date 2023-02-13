import express, {Request, Response, Router} from 'express';
import PrivateChatModel from '../models/private-chat/PrivateChatModel';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';
import MessageModel from '../models/message/MessageModel';
import {PrivateChatRequest} from '../models/private-chat/PrivateChatRequest';
import {MessageRequest} from '../models/message/MessageRequest';
import {AddUserRequest} from '../models/private-chat/AddUserRequest';

const router: Router = express.Router();

router.get('/:id/users/:userId', async (req: Request, res: Response) => {
    const privateChatId = req.params.id;
    const userId = req.params.userId;
    const privateChat = await PrivateChatModel.findOne({_id: privateChatId});

    if (!privateChat) return res.sendStatus(404);
    if (!privateChat.users.includes(userId)) return res.sendStatus(403);

    const populatedChat = await privateChat.populate('messages');
    return res.status(200).json({privateChat: populatedChat});
});

router.post('/', async (req: Request, res: Response) => {
    const privateChatRequest = PrivateChatRequest.check(req.body);
    try {
        const createdChat = await PrivateChatModel.create(privateChatRequest);
        return res.status(201).json({privateChat: createdChat});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).send({error: errorMessage});
    }
});

router.post('/:id/messages', async (req: Request, res: Response) => {
    const privateChatId = req.params.id;
    const messageRequest = MessageRequest.check(req.body);
    try {
        const privateChat = await PrivateChatModel.findOne({_id: privateChatId});

        if (!privateChat) return res.sendStatus(404);
        if (!privateChat.users.includes(messageRequest.userId)) return res.sendStatus(403);

        const message = await MessageModel.create({user: messageRequest.userId, text: messageRequest.text});
        await PrivateChatModel
            .findOneAndUpdate({_id: privateChatId},
                {$push: {messages: message._id}});
        return res.status(200).json({message: message});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.post('/:id/users', async (req: Request, res: Response): Promise<Response> => {
    const privateChatId = req.params.id;
    const addUserRequest = AddUserRequest.check(req.body);

    try {
        const privateChat = await PrivateChatModel.findOne({_id: privateChatId});

        if (!privateChat) return res.sendStatus(404);
        if (!privateChat.users.includes(addUserRequest.userId)) return res.sendStatus(403);

        const updatedPrivateChat = await PrivateChatModel
            .findOneAndUpdate({_id: privateChatId},
                {$addToSet: {users: addUserRequest.userToAdd}},
                {new: true})
            .populate('messages');

        return res.json({privateChat: updatedPrivateChat});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.get('/', async (req: Request, res: Response): Promise<Response> => {
    let usersId = req.query.userId;
    if (usersId) {
        if (typeof usersId === 'string') usersId = [usersId];
        try {
            const privateChats = await PrivateChatModel.find({users: {$all: usersId}}).populate('messages');
            return res.json({privateChats});
        } catch (e) {
            const errorMessage = parseErrorMessage(e);
            return res.status(404).json({error: errorMessage});
        }
    }

    const privateChats = await PrivateChatModel.find({}).populate('messages');
    return res.json({privateChats});
});

export default router;