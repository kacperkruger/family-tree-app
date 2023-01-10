import express, {Express} from 'express';

const expressConfig = (app: Express) => {
    app.use(express.json());
};

export default expressConfig;