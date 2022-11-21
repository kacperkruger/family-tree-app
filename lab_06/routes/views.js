const express = require('express');
const router = express.Router();

const axios = require("axios");
const ROLES = require("../authentication/roles");

router.get('/register', async (req, res) => {
    res.render('register', {
        title: 'register',
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

module.exports = router;