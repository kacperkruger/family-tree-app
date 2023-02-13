import http from 'http';
import {Server, Socket} from 'socket.io';
import dotenv from 'dotenv';
import {PrivateChatResponse} from '@kacperkruger/clients/dist/private-chat/domain/PrivateChatResponse';

dotenv.config();

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: [process.env.WEB_CLIENT_HOST_URL || '']
    }
});

const workspaces = io.of(/^\/chat\/private\/\w+\/messages$/);

workspaces.on('connection', async socket => {
    socket.on('message', data => {
        socket.broadcast.emit('message', data);
    });
});

io.of('/chat/public').on('connection', async socket => {
    socket.on('message', data => {
        socket.broadcast.emit('message', data);
    });
});

const userIdSocketMap = new Map<string, Socket>();
io.of('/chat/private').on('connection', async socket => {
    const userId = socket.handshake.auth.userId;
    userIdSocketMap.set(userId, socket);

    socket.on('message', (data: PrivateChatResponse) => {
        data.users.forEach(user => {
            const userSocket = userIdSocketMap.get(user._id);
            if (!userSocket || userSocket === socket) return;
            socket.to(userSocket.id).emit('message', data);
        });
    });
});

const port = process.env.PORT;
server.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
});
