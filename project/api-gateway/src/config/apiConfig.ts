import {Express} from 'express';
import auth from '../routes/auth';

const apiConfig = (app: Express) => {
    app.use('/api/v1/authentication', auth);
};

export default apiConfig;