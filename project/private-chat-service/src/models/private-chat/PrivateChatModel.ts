import {model, Schema} from 'mongoose';

const chatSchema: Schema = new Schema({
    users: [{
        type: String,
        required: true
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: [],
        required: true
    }]
});

export default model('PrivateChat', chatSchema);