import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
app.use(cors());
dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

const workspaces = io.of(/^\/\w+$/);

workspaces.on('connection', async socket => {
    const workspace = socket.nsp;
    const name = workspace.name;
    console.log(name);
    socket.on('message', data => {
        socket.broadcast.emit('message', data);
    });
});

const port = process.env.PORT;
server.listen(port);
console.log(`API server listening at http://localhost:${port}`);