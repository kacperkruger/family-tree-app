import {Express} from 'express';
import user from '../routes/user';

const apiConfig = (app: Express) => {
    app.use('/api/v1/users', user);
};

export default apiConfig;