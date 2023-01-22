import {Array, Record, String} from 'runtypes';

export const PrivateChatRequest = Record({
    users: Array(String)
});