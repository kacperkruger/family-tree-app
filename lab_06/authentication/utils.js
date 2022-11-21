const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User')
const ROLES = require("./roles");

const createAdmin = async _ => {
    const password = await hashPassword('admin')
    const registrationDate = new Date();
    try {
        await User.findOneAndUpdate({
            username: 'admin',
            email: 'admin@tsw.edu.pl',
            password,
            role: ROLES.ADMIN,
            registrationDate
        }, { expire: new Date() }, { upsert: true, new: true, setDefaultsOnInsert: true })
    } catch (e) {
        console.log(e.codeName)
    }

}


const setup = async () => {
    passport.serializeUser((user, done) => done(null, user._id))

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id)
            return done(null, user)
        } catch (err) {
            return done(err, null)
        }
    })
}

const hashPassword = async password => {
    if (!password) {
        throw new Error('Password was not provided')
    }

    const salt = await bcrypt.genSalt(Math.random() * (15 - 10) + 10)
    return await bcrypt.hash(password, salt)
}

const verifyPassword = async (candidate, actual) => {
    return await bcrypt.compare(candidate, actual)
}

const checkIsInRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login')
    }

    const hasRole = roles.find(role => req.user.role === role)
    if (!hasRole) {
        return res.redirect('/login')
    }

    return next()
}

module.exports = {createAdmin ,setup, hashPassword, verifyPassword, checkIsInRole}