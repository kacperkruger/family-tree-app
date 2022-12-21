import {model, Schema} from 'mongoose';
import {IUser} from './IUser';

const userSchema: Schema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export default model('User', userSchema);