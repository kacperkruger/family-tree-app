import connectToMongo from './utils/connectToMongo';
import express from 'express';
import startServer from './utils/startServer';
import parseError from './utils/parseError';
import dotenvConfig from './configs/dotenvConfig';
import expressConfig from './configs/expressConfig';
import passportConfig from './configs/passportConfig';
import apiConfig from './configs/apiConfig';
import mongoUserModelConfig from './configs/mongoUserModelConfig';

const app = express();

dotenvConfig();
expressConfig(app);
apiConfig(app);
mongoUserModelConfig();
passportConfig();

connectToMongo().then(_ => {
    startServer(app);
}).catch(e => {
    parseError(e, console.log);
});