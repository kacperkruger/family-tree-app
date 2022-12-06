const express = require('express');
const router = express.Router();

const passport = require("passport");
const Chat = require("../models/Chat");
const {verifyPassword} = require("../authentication/utils");
const {request} = require("express");
router.get('/', (_req, res) => res.render('login'));

router.post('/', passport.authenticate('user', {
    failureRedirect: '/login',
    failureMessage: true
}), function (req, res) {
    res.redirect('/dashboard');
});

module.exports = router;