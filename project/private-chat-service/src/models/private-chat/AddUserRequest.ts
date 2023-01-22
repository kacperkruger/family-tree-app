import {Record, String} from 'runtypes';

export const AddUserRequest = Record({
    userToAdd: String,
    userId: String
});