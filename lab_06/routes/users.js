const express = require('express');
const router = express.Router();

const User = require('../models/User');
const ROLES = require("../authentication/roles");
const {hashPassword} = require("../authentication/utils");

router.get('/', async (req, res) => {
    const users = await User.find({})
    return res.send({allUsers: users})
});

router.post('/', async (req, res) => {
    const body = req.body
    try {
        if (body.password !== body.confirmPassword) return res.redirect('/register')

        const registrationDate = new Date();
        const hashedPass = await hashPassword(body.password)

        await User.create({
            username: body.username,
            email: body.email,
            password: hashedPass,
            role: ROLES.USER,
            registrationDate
        })
        return res.status(201).redirect('/dashboard')
    } catch (e) {
        console.log(e)
        return res.redirect('/register')
    }
});

router.get('/:userId', async (req, res) => {
    const id = req.params.userId
    try {
        const user = User.findOne({_id: id})
        return res.send(user)
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
});

router.put('/:userId', async (req, res) => {
    const id = req.params.userId;
    const body = req.body;
    
    try {
        const updatedUser = await User.findOneAndUpdate({_id: id}, {
            login: body.login,
            email: body.email,
            registrationDate: data.registrationDate
        })
        return res.send(updatedUser)
    } catch (e) {
        console.log(e)
        return res.status(500).send(e);
    }
});

router.delete('/:userId', async (req, res) => {
    const id = req.params.userId;
    
    try {
        const deletedUser = await User.findOneAndDelete({_id: id});
        return res.send({deletedUser})
    } catch (e) {
        console.log(e.reason)
        return res.send(e.reason)
    }
});

router.patch('/:userId', async (req, res) => {
    const id = req.params.userId;
    const body = req.body

    try {
        const user = await User.findOne({_id: id})
        const updatedUser = await User.findOneAndUpdate({_id: id}, {
            login: body.login || user.login,
            email: body.email || user.email,
            registrationDate: body.registrationDate || user.registrationDate
        })
        return res.send(updatedUser)
    } catch (e) {
        console.log(e)
        return res.status(500).send(e);
    }
});


module.exports = router;

