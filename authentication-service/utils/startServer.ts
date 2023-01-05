import {Express} from 'express';

const startServer = (app: Express) => {
    const port = process.env.PORT;

    app.listen(port, () => {
        console.log(`API server listening at http://localhost:${port}`);
    });
};

export default startServer;