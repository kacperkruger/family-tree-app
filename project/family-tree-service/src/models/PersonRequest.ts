import {Null, Record, String} from 'runtypes';
import {Gender} from './Gender';


export const PersonRequest = Record({
    name: String,
    surname: String.Or(Null),
    gender: Gender.Or(Null),
    dateOfBirth: String.Or(Null)
});
