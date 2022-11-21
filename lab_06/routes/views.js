const express = require('express');
const router = express.Router();
const User = require('../models/User');

const axios = require("axios");
const ROLES = require("../authentication/roles");

router.get('/', async (req, res) => {
    const response = await axios.get('http://localhost:3000/api/users')
    const users = response.data.allUsers
    res.render('userList', {
        title: 'user list',
        users
    })
});

router.get('/register', async (req, res) => {
    res.render('register', {
        title: 'register',
    })
});

router.get('/dashboard', async (req, res) => {
   const user = req.user;
   if (!user) return res.redirect('/login');

   if (user?.role === ROLES.USER) {
       return res.render('userDashboard', {user})
   }

   console.log("Admin")
});

module.exports = router;