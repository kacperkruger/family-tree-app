const express = require('express');
const router = express.Router();

const axios = require("axios");
const ROLES = require("../authentication/roles");
const User = require('../models/User');
const Chat = require('../models/Chat');
const {verifyPassword} = require("../authentication/utils");

router.get('/register', async (req, res) => {
    res.render('form', {
        title: 'register',
    })
});

Chat.find({})
    .then(response => {
        response.forEach(chat => {
            router.get(`/chats/${chat.name}`, async (req, res) => {
                return res.render('chatLogin', {
                    name: chat.name
                })
            });
        })
    })
    .catch(e => console.log(e))

router.post('/chats/:name', async (req, res) => {
    const data = req.body
    const name = req.params.name;
    try {
        const chat = await Chat.findOne({name});
        if (!chat) return res.status(400).send('Incorrect username or password')

        const isCorrectPass = await verifyPassword(data.password, chat.password);

        if (!isCorrectPass) return res.redirect(`/chats/${name}`)
        const user = req.user;
        if (!user) return res.redirect('/login');

        return res.render('chat', {
            topic: chat.name,
            username: req.user.username
        })
    } catch (e) {
        console.log(e)
    }
})


router.get('/dashboard', async (req, res) => {
    const user = req.user;
    if (!user) return res.redirect('/login');

    if (user?.role === ROLES.USER) {
        return res.render('dashboard', {user});
    }

    const response = await axios.get('http://www.localhost:3000/api/users');
    const users = response.data.allUsers;
    return res.render('dashboard', {user, users});
});

router.get('/edit/:userId', async (req, res) => {
    const id = req.params.userId;
    try {
        const user = await User.findOne({_id: id});
        return res.render('form', {
            title: 'edit',
            user
        });
    } catch (e) {
        console.log(e)
    }
});


module.exports = router;