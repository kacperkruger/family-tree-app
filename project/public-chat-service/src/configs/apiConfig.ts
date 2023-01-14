import {Express} from 'express';
import publicChat from '../routes/publicChat';

const apiConfig = (app: Express) => {
    app.use('/api/v1/chats/public', publicChat);
};

export default apiConfig;