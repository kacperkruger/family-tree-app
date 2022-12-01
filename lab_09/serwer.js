const express = require('express');
const path = require('path');
const hbs = require('hbs');
const validateUserStrategy = require('./authentication/validateUserStrategy')
const mongoose = require('mongoose');
const {setup} = require("./authentication/utils");
const User = require('./models/User');
const Chat = require('./models/Chat');
const Message = require('./models/Message');


const app = express();
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'templates', 'views'));
hbs.registerPartials(path.join(__dirname, 'templates', 'partials'));
const secret = process.env.APP_SECRET || '$sekretny $sekret';

const httpServer = require("http").createServer(app);

app.use(require('cookie-parser')());
app.use(require('express-session')({
    secret: secret, resave: false, saveUninitialized: false
}));


app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
passport.use(validateUserStrategy);
setup()

const users = require('./routes/users');
const auth = require('./routes/authentication')
const views = require('./routes/views');
app.use('/api/users', users);
app.use('/login', auth);
app.use('/', views);

require('dotenv').config();
const dbConnData = {
    host: process.env.MONGO_HOST || '127.0.0.1',
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DATABASE || 'lab07'
};

const io = require("socket.io")(httpServer);

const workspaces = io.of(/^\/\w+$/);

workspaces.on('connection', async socket => {
    const workspace = socket.nsp;
    const name = workspace.name;
    const topic = name.slice(1)
    const chat = await Chat.findOneAndUpdate({name: topic}, {}, {upsert: true, new: true}).populate('messages');
    for (const message of chat.messages) {
        const populatedMessage = await message.populate('user')
        const messageDTO = {
            username: populatedMessage.user.username,
            message: populatedMessage.message
        }
        socket.send(messageDTO)
    }
    socket.on('message', async (data) => {
        try {
            const dataJson = JSON.parse(data)
            const user = await User.findOne({username: dataJson.username});
            const newMessage = await Message.create({
                user: user._id,
                message: dataJson.message
            })
            const chat = await Chat.findOne({name: topic}).populate('messages');
            const messages = chat.messages
            await Chat.updateOne({name: topic}, {
                messages: [...messages, newMessage]
            })

            socket.broadcast.emit('message', JSON.parse(data));
        } catch (e) {
            console.log(e)
            console.log("error")
        }
    })

})

mongoose
    .connect(`mongodb://${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`, {
        useNewUrlParser: true, useUnifiedTopology: true
    })
    .then(response => {
        console.log(`Connected to MongoDB. Database name: "${response.connections[0].name}"`)
        const apiPort = process.env.PORT || 3000
        const apiHost = process.env.API_HOST || 'localhost';
        httpServer.listen(apiPort, () => {
            console.log(`websocket server available from: ws://${apiHost}:${apiPort}`);
        });
    })
    .catch(error => console.error('Error connecting to MongoDB', error));
