const express = require('express');
const router = express.Router();

const passport = require("passport");
router.get('/', (_req, res) => res.render('login'));

router.post('/', passport.authenticate('local', {
    failureRedirect: '/login',
    failureMessage: true
}), function (req, res) {
    res.redirect('/dashboard');
});

module.exports = router;