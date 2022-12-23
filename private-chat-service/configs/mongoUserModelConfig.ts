import {model, Schema} from 'mongoose';

const mongoUserModelConfig = () => {
    model('User', new Schema({
        password: {
            type: String,
            select: false
        }
    }));
};

export default mongoUserModelConfig;
