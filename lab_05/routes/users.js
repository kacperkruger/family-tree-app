const express = require('express');
const router = express.Router();

const User = require('../models/User');

// Pobranie danych wszystkich użytkowników
router.get('/', async (req, res) => {
    return res.send({
        allUsers: []
    });
});

// Utworzenie nowego użytkownika
router.post('/', async (req, res) => {
    return res.send(req.body);
});

// Pobranie danych użytkownika o podanym userId
router.get('/:userId', async (req, res) => {
    return res.send({});
});

// Zastąpienie danych użytkownika o podanym userId nowym „kompletem”
router.put('/:userId', async (req, res) => {
    const id = req.params.userId;
    return res.send({
        putUserId: id
    });
});

// Usuniecie użytkownika o podanym userId
router.delete('/:userId', async (req, res) => {
    const id = req.params.userId;
    return res.send({
        deletedUserId: id
    });
});

// „Unacześnienie” wybranych danych użytkownika o podanym userId
router.patch('/:userId', async (req, res) => {
    const id = req.params.userId;
    return res.send({
        patchUserId: id
    });
});

module.exports = router;

