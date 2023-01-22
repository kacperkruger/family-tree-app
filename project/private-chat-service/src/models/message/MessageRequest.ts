import {Record, String} from 'runtypes';

export const MessageRequest = Record({
    userId: String,
    text: String
});