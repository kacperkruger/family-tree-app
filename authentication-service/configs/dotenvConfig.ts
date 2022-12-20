import dotenv from 'dotenv';

const dotenvConfig = () => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(__dirname);
        dotenv.config({path: __dirname + '/.env'});
    }
};

export default dotenvConfig;