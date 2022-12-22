import {model, Schema} from 'mongoose';
import {IPrivateChat} from './IPrivateChat';

const chatSchema: Schema = new Schema<IPrivateChat>({
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true,
        minlength: 2
    }]
});

export default model<IPrivateChat>('PrivateChat', chatSchema);