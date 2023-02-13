import {Record, String} from 'runtypes';
import {Gender} from './Gender';


export const PersonRequest = Record({
    name: String,
    surname: String,
    gender: Gender,
    dateOfBirth: String
});
