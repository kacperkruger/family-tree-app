import {model, Schema} from 'mongoose';

const chatSchema: Schema = new Schema({
    users: [{
        type: Schema.Types.ObjectId,
        required: true
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    }]
});

export default model('PrivateChat', chatSchema);