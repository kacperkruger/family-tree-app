import express, {Request, Response} from 'express';
import {getUsersDetails} from '@kacperkruger/clients/user';
import {isClientError} from '@kacperkruger/clients';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await getUsersDetails([]);
        res.json({users});
    } catch (e) {
        console.log(e);
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

export default router;