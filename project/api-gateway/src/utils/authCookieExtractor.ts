import {Request} from 'express';

const authCookieExtractor = (req: Request) => {
    let token = null;
    if (req && req.cookies) {
        console.log('b');
        token = req.cookies['Access-Token'];
    }
    console.log(token);
    return token;
};

export default authCookieExtractor;