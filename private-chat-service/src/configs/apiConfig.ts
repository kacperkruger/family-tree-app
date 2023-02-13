import {Express} from 'express';
import privateChat from '../routes/privateChat';

const apiConfig = (app: Express) => {
    app.use('/api/v1/chats/private', privateChat);
};

export default apiConfig;