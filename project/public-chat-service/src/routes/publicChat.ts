import express, {Request, Response, Router} from 'express';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';
import Message from '../models/Message';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const data = req.body;
    try {
        let createdMessage = await Message.create({
            user: data.userId,
            text: data.text
        });
        return res.status(201).json({createdMessage});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).send({error: errorMessage});
    }
});

router.get('/', async (_req: Request, res: Response): Promise<Response> => {
    const messages = await Message.find();
    return res.json(messages);
});

export default router;