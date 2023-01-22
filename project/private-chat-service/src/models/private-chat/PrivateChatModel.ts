import {model, Schema} from 'mongoose';

const chatSchema: Schema = new Schema({
    users: [{
        type: String,
        required: true
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    }]
});

export default model('PrivateChat', chatSchema);