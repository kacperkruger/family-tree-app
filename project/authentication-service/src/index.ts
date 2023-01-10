import express from 'express';
import {startServer} from '@kacperkruger/common-server-utils';
import dotenvConfig from './configs/dotenvConfig';
import expressConfig from './configs/expressConfig';
import passportConfig from './configs/passportConfig';
import apiConfig from './configs/apiConfig';

const app = express();

dotenvConfig();
expressConfig(app);
apiConfig(app);
passportConfig();

startServer(app);
