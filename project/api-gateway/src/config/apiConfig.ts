import {Express} from 'express';
import auth from '../routes/auth';
import privateChat from '../routes/privateChat';
import passport from 'passport';

const apiConfig = (app: Express) => {
    app.use('/api/v1/authentication', auth);
    app.use('/api/v1/chats/private', passport.authenticate('jwt', {session: false}), privateChat);
};

export default apiConfig;