import express, {Request, Response} from 'express';
import User from '../models/User';
import hashPassword from '../utils/hashPassword';
import parseError from '../utils/parseError';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const hashedPassword = hashPassword(data.password);
        await User.create({
            username: data.username,
            email: data.email,
            password: hashedPassword
        });
        return res.sendStatus(201);
    } catch (e) {
        return parseError(e, res.status(400).send);
    }
});

export default router;