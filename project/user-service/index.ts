import connectToMongo from './utils/connectToMongo';
import express from 'express';
import dotenvConfig from './configs/dotenvConfig';
import expressConfig from './configs/expressConfig';
import apiConfig from './configs/apiConfig';
import {parseErrorMessage, startServer} from 'common-server-utils';

const app = express();

dotenvConfig();
expressConfig(app);
apiConfig(app);

connectToMongo().then(_ => {
    startServer(app);
}).catch(e => {
    const errorMessage = parseErrorMessage(e);
    console.log(errorMessage);
});