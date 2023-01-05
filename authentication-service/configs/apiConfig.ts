import {Express} from 'express';
import authentication from '../routes/authentication';

const apiConfig = (app: Express) => {
    app.use('/api/v1/authentication', authentication);
};

export default apiConfig;