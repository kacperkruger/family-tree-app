import connectToMongo from './utils/connectToMongo';
import express from 'express';
import startServer from './utils/startServer';
import parseError from './utils/parseError';
import dotenvConfig from './configs/dotenvConfig';
import expressConfig from './configs/expressConfig';
import apiConfig from './configs/apiConfig';

const app = express();

dotenvConfig();
expressConfig(app);
apiConfig(app);

connectToMongo().then(_ => {
    startServer(app);
}).catch(e => {
    parseError(e, console.log);
});