import {Express} from 'express';
import user from '../routes/user';

const apiConfig = (app: Express) => {
    app.use('/api/v1/user', user);
};

export default apiConfig;