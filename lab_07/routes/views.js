const express = require('express');
const router = express.Router();

const axios = require("axios");
const ROLES = require("../authentication/roles");
const User = require('../models/User');

router.get('/register', async (req, res) => {
    res.render('form', {
        title: 'register',
    })
});

router.get('/chat', async (req, res) => {
    const user = req.user;
    if (!user) return res.redirect('/login');

    res.render('chat', {
        userLogin: req.user.login
    })
});

router.get('/dashboard', async (req, res) => {
   const user = req.user;
   if (!user) return res.redirect('/login');

   if (user?.role === ROLES.USER) {
       return res.render('dashboard', { user });
   }

   const response = await axios.get('http://www.localhost:3000/api/users');
   const users = response.data.allUsers;
   return res.render('dashboard', { user, users });
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