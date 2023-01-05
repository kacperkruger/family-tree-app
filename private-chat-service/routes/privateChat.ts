import express, {Request, Response, Router} from 'express';
import {Types} from 'mongoose';
import PrivateChat from '../models/private-chat/PrivateChat';
import parseErrorMessage from '../utils/parseErrorMessage';
import Message from '../models/message/Message';

const router: Router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
    const privateChatId = req.params.id;
    const data = req.body;
    const userId = new Types.ObjectId(data.userId);
    let privateChat = await PrivateChat.findOne({_id: privateChatId});

    if (!privateChat) return res.sendStatus(404);
    if (!privateChat.users.includes(userId)) return res.sendStatus(401);

    privateChat = await privateChat.populate('users');
    privateChat = await privateChat.populate('messages');
    privateChat = await privateChat.populate({path: 'messages', populate: 'user'});

    return res.status(200).json({privateChat});
});

router.post('/', async (req: Request, res: Response) => {
    const data = req.body;
    try {
        let createdChat = await PrivateChat.create({
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

router.patch('/:id/add/message', async (req: Request, res: Response) => {
    const privateChatId = req.params.id;
    const userId = req.body.userId;
    const text = req.body.text;
    try {
        const privateChat = await PrivateChat.findOne({_id: privateChatId});

        if (!privateChat) return res.sendStatus(404);
        if (!privateChat.users.includes(userId)) return res.sendStatus(401);

        const message = await Message.create({user: userId, text});
        const updatedPrivateChat = await PrivateChat
            .findOneAndUpdate({_id: privateChatId},
                {$push: {messages: message._id}},
                {new: true})
            .populate('users')
            .populate('messages')
            .populate({path: 'messages', populate: 'user'});

        return res.status(200).send(updatedPrivateChat);
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.patch('/:id/add/user', async (req: Request, res: Response) => {
    const privateChatId = req.params.id;
    const userId = req.body.userId;
    const user = req.body.user;

    try {
        const privateChat = await PrivateChat.findOne({_id: privateChatId});

        if (!privateChat) return res.sendStatus(404);
        if (!privateChat.users.includes(userId)) return res.sendStatus(401);

        const updatedPrivateChat = await PrivateChat
            .findOneAndUpdate({_id: privateChatId},
                {$addToSet: {users: user}},
                {new: true})
            .populate('users')
            .populate('messages')
            .populate({path: 'messages', populate: 'user'});

        return res.status(200).send(updatedPrivateChat);
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.get('/users', async (req: Request, res: Response) => {
    const userIds = req.query.userIds;
    try {
        const privateChats = await PrivateChat.find({users: {$all: userIds}})
            .populate('users')
            .populate('messages')
            .populate({path: 'messages', populate: 'user'});

        return res.send(200).json(privateChats);
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(404).json({error: errorMessage});
    }
});

export default router;