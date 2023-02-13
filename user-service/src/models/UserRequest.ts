import {Record, String} from 'runtypes';

export const UserRequest = Record({
    username: String,
    email: String,
    password: String
});