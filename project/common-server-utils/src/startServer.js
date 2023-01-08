"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const startServer = (app) => {
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`API server listening at http://localhost:${port}`);
    });
};
exports.default = startServer;
