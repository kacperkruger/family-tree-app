import express, {Express} from 'express';
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
    app.use(passport.initialize());
};

export default expressConfig;