const express = require('express');
const path = require('path');
const hbs = require('hbs');
const validateUserStrategy = require('./authentication/validateUserStrategy')
const mongoose = require('mongoose');
const { setup, createAdmin } = require("./authentication/utils");
const User = require("./models/User")



const app = express();
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'templates', 'views'));
hbs.registerPartials(path.join(__dirname, 'templates', 'partials'));
const secret = process.env.APP_SECRET || '$sekretny $sekret';

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
    database: process.env.MONGO_DATABASE || 'lab06'
};

createAdmin()

mongoose
    .connect(`mongodb://${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`, {
        useNewUrlParser: true, useUnifiedTopology: true
    })
    .then(response => {
        console.log(`Connected to MongoDB. Database name: "${response.connections[0].name}"`)
        const apiPort = process.env.PORT || 3000
        const apiHost = process.env.API_HOST || 'localhost';
        app.listen(apiPort, () => {
            console.log(`API server available from: http://${apiHost}:${apiPort}`);
        });
    })
    .catch(error => console.error('Error connecting to MongoDB', error));
