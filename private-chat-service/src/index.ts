import connectToMongo from './utils/connectToMongo';
import express from 'express';
import {startServer} from '@kacperkruger/common-server-utils';
import dotenv from 'dotenv';
import apiConfig from './configs/apiConfig';

const app = express();

dotenv.config();
app.use(express.json());
apiConfig(app);

connectToMongo().then(_ => {
    startServer(app);
});