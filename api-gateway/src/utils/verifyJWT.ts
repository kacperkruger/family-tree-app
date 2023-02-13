import {VerifiedCallback} from 'passport-jwt';

const verifyJWT = (payload: { id: string }, done: VerifiedCallback) => {
    return done(null, {_id: payload.id});
};

export default verifyJWT;