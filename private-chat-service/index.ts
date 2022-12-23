import connectToMongo from './utils/connectToMongo';
import express from 'express';
import startServer from './utils/startServer';
import parseErrorMessage from './utils/parseErrorMessage';
import dotenvConfig from './configs/dotenvConfig';
import expressConfig from './configs/expressConfig';
import apiConfig from './configs/apiConfig';
import mongooseConfig from './configs/mongooseConfig';

const app = express();

dotenvConfig();
expressConfig(app);
apiConfig(app);

connectToMongo().then(_ => {
    mongooseConfig();
    startServer(app);
}).catch(e => {
    const errorMessage = parseErrorMessage(e);
    console.log(errorMessage);
});