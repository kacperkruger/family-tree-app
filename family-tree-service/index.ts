import express from 'express';
import startServer from './utils/startServer';
import parseErrorMessage from './utils/parseErrorMessage';
import dotenvConfig from './configs/dotenvConfig';
import expressConfig from './configs/expressConfig';
import connectToNeo4j from './utils/connectToNeo4j';

const app = express();

dotenvConfig();
expressConfig(app);

connectToNeo4j().then(_ => {
    startServer(app);
}).catch(e => {
    console.log(parseErrorMessage(e));
});