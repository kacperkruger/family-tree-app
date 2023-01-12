import connectToMongo from './utils/connectToMongo';
import express from 'express';
import apiConfig from './configs/apiConfig';
import {parseErrorMessage, startServer} from '@kacperkruger/common-server-utils/';
import dotenv from 'dotenv';

declare global {
    namespace Express {
        interface Request {
            user?: string;
        }
    }
}

const app = express();

dotenv.config();
app.use(express.json());
apiConfig(app);

connectToMongo().then(_ => {
    startServer(app);
}).catch(e => {
    console.log(e);
    const errorMessage = parseErrorMessage(e);
    console.log(errorMessage);
});