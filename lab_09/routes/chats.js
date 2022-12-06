const express = require('express');
const router = express.Router();

const {hashPassword} = require("../authentication/utils");
const Chat = require("../models/Chat");

router.get('/', async (req, res) => {
    const chats = await Chat.find({});
    const names = chats.reduce((acc, curr) => {
        return [...acc, curr.name];
    }, []);
    res.send(JSON.stringify({names}));
})

router.post('/', async (req, res) => {
    const body = req.body
    console.log("eee")
    try {
        const hashedPass = await hashPassword(body.password)
        await Chat.create({
            name: body.name,
            password: hashedPass,
            messages: []
        })
        return res.sendStatus(200);
    } catch (e) {
        console.log(e)
        return res.sendStatus(400);
    }
});

module.exports = router;