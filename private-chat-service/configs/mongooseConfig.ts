import {model, Schema} from 'mongoose';

const mongooseConfig = () => {
    model('User', new Schema({
        password: {
            type: String,
            select: false
        }
    }));
};

export default mongooseConfig;
