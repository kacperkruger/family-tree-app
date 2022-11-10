const express = require('express');
const router = express.Router();

const User = require('../models/User');

// Pobranie danych wszystkich użytkowników
router.get('/', async (req, res) => {
    const users = await User.find({})
    return res.send({allUsers: users})
});

// Utworzenie nowego użytkownika
router.post('/', async (req, res) => {
    const data = req.data

    try {
        const newUser = await User.create({ 
            login: data.login,
            email: data.email,
            registrationDate: data.registrationDate
        })
        return res.status(201).send({newUser: user})
    } catch (e) {
        console.log(e)
        return res.status(500).send(e.getMessage())
    }
});

// Pobranie danych użytkownika o podanym userId
router.get('/:userId', async (req, res) => {
    const id = request.params.userId
    try {
        user = User.findOne({_id: id})
        return res.send(user)
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
});

// Zastąpienie danych użytkownika o podanym userId nowym „kompletem”
router.put('/:userId', async (req, res) => {
    const id = req.params.userId;
    const data = req.data;
    
    try {
        const updatedUser = await User.findOneAndUpdate({_id: id}, {
            login: data.login,
            email: data.email,
            registrationDate: data.registrationDate
        })
        return res.send(updatedUser)
    } catch (e) {
        console.log(e)
        return res.status(500).send(e);
    }
});

// Usuniecie użytkownika o podanym userId
router.delete('/:userId', async (req, res) => {
    const id = req.params.userId;
    
    try {
        const deletedUser = await User.findOneAndDelete({_id: id});
        return res.send({deletedUser})
    }
});

// „Unacześnienie” wybranych danych użytkownika o podanym userId
router.patch('/:userId', async (req, res) => {
    const id = req.params.userId;
    
    try {
        const user = await User.findOne({_id: id})
        const updatedUser = await User.findOneAndUpdate({_id: id}, {
            login: data.login || user.login,
            email: data.email || user.email,
            registrationDate: data.registrationDate || user.registrationDate
        })
        return res.send(updatedUser)
    } catch (e) {
        console.log(e)
        return res.status(500).send(e);
    }
});

module.exports = router;

