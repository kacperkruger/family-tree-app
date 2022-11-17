const express = require('express');
const router = express.Router();

const axios = require("axios");

router.get('/', async (req, res) => {
    const response = await axios.get('http://localhost:3000/users')
    const users = response.data.allUsers
    console.log(users)
    res.render('userList', {
        title: 'user list',
        users
    })
});

router.get('/add', async (req, res) => {
    const response = await axios.get('http://localhost:3000/users')
    const users = response.data.allUsers
    res.render('userAdd', {
        title: 'user add',
    })
});

module.exports = router;