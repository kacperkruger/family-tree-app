import {Express} from 'express';
import auth from '../routes/auth';
import privateChat from '../routes/privateChat';

const apiConfig = (app: Express) => {
    app.use('/api/v1/authentication', auth);
    app.use('/api/v1/chats/private', privateChat);
};

export default apiConfig;