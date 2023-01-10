import passport from 'passport';
import PassportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import {getUserDetails, getUserSensitiveData} from '@kacperkruger/clients/user';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';

const passportConfig = () => {
    const LocalStrategy = PassportLocal.Strategy;

    const verifyPassword = (candidate: string, actual: string): Promise<boolean> => {
        return bcrypt.compare(candidate, actual);
    };

    const authenticateUser = async (username: string, password: string, done: Function) => {
        try {
            const userSensitiveData = await getUserSensitiveData(username);
            const isCorrectPass = await verifyPassword(password, userSensitiveData.password);
            if (!isCorrectPass) return done(null, false, {message: 'Incorrect username or password.'});
            const user = await getUserDetails(userSensitiveData._id);
            return done(null, user);
        } catch (e) {
            const errorMessage = parseErrorMessage(e);
            return done(errorMessage, null);
        }
    };

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, authenticateUser));
    passport.serializeUser((user: Express.User, done: Function) => done(null, user._id));
    passport.deserializeUser(async (id: string, done: Function) => {
        try {
            const user = await getUserDetails(id);
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    });
};

export default passportConfig;