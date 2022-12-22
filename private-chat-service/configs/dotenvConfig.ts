import dotenv from 'dotenv';

const dotenvConfig = () => {
    if (process.env.NODE_ENV !== 'production') {
        dotenv.config({path: __dirname + '/.env'});
    }
};

export default dotenvConfig;