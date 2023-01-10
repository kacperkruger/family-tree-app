import express from 'express';
import {parseErrorMessage, startServer} from 'common-server-utils';
import dotenvConfig from './routes/configs/dotenvConfig';
import expressConfig from './routes/configs/expressConfig';
import connectToNeo4j from './utils/connectToNeo4j';
import apiConfig from './routes/configs/apiConfig';

const app = express();

dotenvConfig();
expressConfig(app);
apiConfig(app);

connectToNeo4j().then(_ => {
    startServer(app);
}).catch(e => {
    console.log(parseErrorMessage(e));
});
