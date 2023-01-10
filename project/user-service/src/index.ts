import connectToMongo from './utils/connectToMongo';
import express from 'express';
import expressConfig from './configs/expressConfig';
import apiConfig from './configs/apiConfig';
import {parseErrorMessage, startServer} from '@kacperkruger/common-server-utils/';
import dotenvConfig from './configs/dotenvConfig';

const app = express();

dotenvConfig();
expressConfig(app);
apiConfig(app);

connectToMongo().then(_ => {
    startServer(app);
}).catch(e => {
    console.log(e);
    const errorMessage = parseErrorMessage(e);
    console.log(errorMessage);
});