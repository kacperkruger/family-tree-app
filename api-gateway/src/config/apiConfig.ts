import {Express} from 'express';
import auth from '../routes/auth';
import privateChat from '../routes/privateChat';
import passport from 'passport';
import publicChat from '../routes/publicChat';
import familyTree from '../routes/familyTree';
import users from '../routes/users';

const apiConfig = (app: Express) => {
    app.use('/api/v1/authentication', auth);
    app.use('/api/v1/chats/private', passport.authenticate('jwt', {session: false}), privateChat);
    app.use('/api/v1/chats/public', passport.authenticate('jwt', {session: false}), publicChat);
    app.use('/api/v1/family-trees', passport.authenticate('jwt', {session: false}), familyTree);
    app.use('/api/v1/users', passport.authenticate('jwt', {session: false}), users);
};

export default apiConfig;