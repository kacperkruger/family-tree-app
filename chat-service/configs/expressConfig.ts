import express, {Express} from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: string;
        }
    }
}

const expressConfig = (app: Express) => {
    app.use(express.json());
};

export default expressConfig;