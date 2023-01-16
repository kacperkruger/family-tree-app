import express from 'express';
import dotenv from 'dotenv';
import {startServer} from '@kacperkruger/common-server-utils';
import passportConfig from './config/passportConfig';
import apiConfig from './config/apiConfig';
import expressConfig from './config/expressConfig';

const app = express();

dotenv.config();
expressConfig(app);
apiConfig(app);
passportConfig();

startServer(app);
