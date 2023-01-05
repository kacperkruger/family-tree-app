import passport from 'passport';
import PassportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import {Express} from 'express';
import User from '../models/User';

const passportConfig = () => {
    const LocalStrategy = PassportLocal.Strategy;

    const verifyPassword = (candidate: string, actual: string): Promise<boolean> => {
        return bcrypt.compare(candidate, actual);
    };

    const authenticateUser = async (username: string, password: string, done: Function) => {
        const user = await User.findOne({username});
        if (!user) return done(null, false, {message: 'Incorrect username or password.'});
        try {
            const isCorrectPass = await verifyPassword(password, user.password);
            if (!isCorrectPass) return done(null, false, {message: 'Incorrect username or password.'});
            return done(null, user);
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, authenticateUser));
    passport.serializeUser((user: Express.User, done: Function) => done(null, user._id));
    passport.deserializeUser(async (id: string, done: Function) => {
        try {
            const user = await User.findById(id);
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    });
};

export default passportConfig;