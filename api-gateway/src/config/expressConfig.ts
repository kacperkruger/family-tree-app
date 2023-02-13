import express, {Express} from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';


declare global {
    namespace Express {
        interface User {
            _id: string;
        }
    }
}

const expressConfig = (app: Express) => {
    app.use(express.json());
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(cors({
        origin: [process.env.WEB_CLIENT_HOST_URL || ''],
        credentials: true
    }));
};

export default expressConfig;