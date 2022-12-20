import connectToMongo from './utils/connectToMongo';
import express from 'express';
import startServer from './utils/startServer';
import parseError from './utils/parseError';
import dotenvConfig from './configs/dotenvConfig';

const app = express();

dotenvConfig();
connectToMongo().then(_ => {
    startServer(app);
}).catch(e => {
    parseError(e, console.log);
});