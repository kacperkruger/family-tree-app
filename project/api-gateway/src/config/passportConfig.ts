import passport from 'passport';
import PassportLocal from 'passport-local';
import PassportJWT from 'passport-jwt';
import authenticateUser from '../utils/authenticateUser';
import verifyJWT from '../utils/verifyJWT';
import authCookieExtractor from '../utils/authCookieExtractor';

const passportConfig = () => {
    const LocalStrategy = PassportLocal.Strategy;
    const JwtStrategy = PassportJWT.Strategy;

    passport.use('local', new LocalStrategy(authenticateUser));
    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: authCookieExtractor,
        secretOrKey: process.env.JWT_SECRET
    }, verifyJWT));
};

export default passportConfig;
