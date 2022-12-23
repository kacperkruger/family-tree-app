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
        required: true
    }]
});

export default model<IPrivateChat>('PrivateChat', chatSchema);