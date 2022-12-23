import {model, Schema} from 'mongoose';

const mongoUserModel = () => {
    model('User', new Schema({
        password: {
            type: String,
            select: false
        }
    }));
};

export default mongoUserModel;
