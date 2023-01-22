import {Array, Record, String} from 'runtypes';
import {MessageResponse} from '../message/MessageResponse';

export const PrivateChatResponse = Record({
    _id: String,
    users: Array(String),
    messages: Array(MessageResponse)
});