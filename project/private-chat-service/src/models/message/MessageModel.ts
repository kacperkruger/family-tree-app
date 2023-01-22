import {model, Schema} from 'mongoose';

const messageScheme: Schema = new Schema({
    user: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});


export default model('Message', messageScheme);