const LocalStrategy = require('passport-local');
const User = require("../models/User");
const {verifyPassword} = require("./utils");

const validateUserStrategy = new LocalStrategy( async (username, password, cb) => {
    try {
        const user = await User.findOne({username});
        if (!user) return cb(null, false, {message: 'Incorrect username or password.'})

        const isCorrectPass = await verifyPassword(password, user.password);

        if (!isCorrectPass) return cb(null, false, {message: 'Incorrect username or password.'})
        return cb(null, user)
    } catch (e) {
        return cb(e);
    }

})

module.exports = validateUserStrategy;