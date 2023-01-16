import express, {Request, Response, Router} from 'express';
import {Types} from 'mongoose';
import PrivateChatModel from '../models/private-chat/PrivateChat';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';
import MessageModel from '../models/message/Message';

const router: Router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
    const privateChatId = req.params.id;
    const data = req.body;
    const userId = new Types.ObjectId(data.userId);
    let privateChat = await PrivateChatModel.findOne({_id: privateChatId});

    if (!privateChat) return res.sendStatus(404);
    if (!privateChat.users.includes(userId)) return res.sendStatus(405);

    privateChat = await privateChat.populate('messages');
    return res.status(200).json({privateChat});
});

router.post('/', async (req: Request, res: Response) => {
    const data = req.body;
    try {
        let createdChat = await PrivateChatModel.create({
            users: data.users,
            messages: []
        });
        createdChat = await createdChat.populate('users');
        return res.status(201).json({createdChat});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).send({error: errorMessage});
    }
});

router.post('/:id/messages', async (req: Request, res: Response) => {
    const privateChatId = req.params.id;
    const userId = req.body.userId;
    const text = req.body.text;
    try {
        const privateChat = await PrivateChatModel.findOne({_id: privateChatId});

        if (!privateChat) return res.sendStatus(404);
        if (!privateChat.users.includes(userId)) return res.sendStatus(405);

        const message = await MessageModel.create({user: userId, text});
        const updatedPrivateChat = await PrivateChatModel
            .findOneAndUpdate({_id: privateChatId},
                {$push: {messages: message._id}},
                {new: true})
            .populate('messages');

        return res.status(200).send(updatedPrivateChat);
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.post('/:id/users', async (req: Request, res: Response): Promise<Response> => {
    const privateChatId = req.params.id;
    const userId = req.body.userId;
    const userToAdd = req.body.userToAdd;

    try {
        const privateChat = await PrivateChatModel.findOne({_id: privateChatId});

        if (!privateChat) return res.sendStatus(404);
        if (!privateChat.users.includes(userId)) return res.sendStatus(405);

        const updatedPrivateChat = await PrivateChatModel
            .findOneAndUpdate({_id: privateChatId},
                {$addToSet: {users: userToAdd}},
                {new: true})
            .populate('messages');

        return res.send(updatedPrivateChat);
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
            const privateChats = await PrivateChatModel.find({users: {$all: usersId}});
            return res.json(privateChats);
        } catch (e) {
            const errorMessage = parseErrorMessage(e);
            return res.status(404).json({error: errorMessage});
        }
    }

    const privateChats = await PrivateChatModel.find({});
    return res.json({privateChats});
});

export default router;