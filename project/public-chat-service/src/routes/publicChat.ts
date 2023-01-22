import express, {Request, Response, Router} from 'express';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';
import Message from '../models/Message';
import {MessageRequest} from '../models/MessageRequest';

const router: Router = express.Router();

router.post('/messages', async (req: Request, res: Response) => {
    const messageRequest = MessageRequest.check(req.body);
    try {
        const createdMessage = await Message.create(messageRequest);
        return res.status(201).json({message: createdMessage});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).send({error: errorMessage});
    }
});

router.get('/messages', async (_req: Request, res: Response): Promise<Response> => {
    const messages = await Message.find();
    return res.json({messages});
});

export default router;