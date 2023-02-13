import {Request} from 'express';

const authCookieExtractor = (req: Request) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['Access-Token'];
    }
    return token;
};

export default authCookieExtractor;