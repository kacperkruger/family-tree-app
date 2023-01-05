import connectToMongo from './utils/connectToMongo';
import express from 'express';
import startServer from './utils/startServer';
import parseErrorMessage from './utils/parseErrorMessage';
import dotenvConfig from './configs/dotenvConfig';
import expressConfig from './configs/expressConfig';
import apiConfig from './configs/apiConfig';
import mongoUserModelConfig from './configs/mongoUserModelConfig';

const app = express();

dotenvConfig();
expressConfig(app);
apiConfig(app);

connectToMongo().then(_ => {
    mongoUserModelConfig();
    startServer(app);
}).catch(e => {
    const errorMessage = parseErrorMessage(e);
    console.log(errorMessage);
});