import express, {Express} from 'express';
import session from 'express-session';
import passport from 'passport';


declare global {
    namespace Express {
        interface User {
            _id: string;
        }
    }
}

const expressConfig = (app: Express) => {
    app.use(express.json());
    app.use(session({
        secret: process.env.SESSION_SECRET || '',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};

export default expressConfig;