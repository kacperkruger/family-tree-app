import {Record, String} from 'runtypes';

export const MessageResponse = Record({
    id: String,
    userId: String,
    text: String
});