import express from 'express';
import {parseErrorMessage, startServer} from '@kacperkruger/common-server-utils';
import connectToNeo4jOrGetDriver from './utils/connectToNeo4jOrGetDriver';
import apiConfig from './configs/apiConfig';
import dotenv from 'dotenv';

const app = express();

dotenv.config();
app.use(express.json());
apiConfig(app);

connectToNeo4jOrGetDriver().then(_ => {
    startServer(app);
}).catch(e => {
    console.log(e);
    console.log(parseErrorMessage(e));
});
