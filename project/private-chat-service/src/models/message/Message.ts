import {model, Schema} from 'mongoose';

const messageScheme: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});


export default model('Message', messageScheme);