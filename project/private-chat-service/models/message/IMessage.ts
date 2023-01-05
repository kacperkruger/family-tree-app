import {Types} from 'mongoose';

export interface IMessage {
    user: {
        type: Types.ObjectId,
        required: true
    },
    text: {
        type: string,
        required: true
    }
}