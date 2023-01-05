import {model, Schema} from 'mongoose';
import {IMessage} from './IMessage';

const messageScheme: Schema = new Schema<IMessage>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

export default model<IMessage>('Message', messageScheme);