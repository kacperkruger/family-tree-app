import express, {Express} from 'express';

declare global {
    namespace Express {
        interface User {
            _id: string;
        }
    }
}

const expressConfig = (app: Express) => {
    app.use(express.json());
};

export default expressConfig;