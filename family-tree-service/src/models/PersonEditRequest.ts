import {Array, Record, String} from 'runtypes';
import {Gender} from './Gender';

const PersonId = String;
export const PersonEditRequest = Record({
    name: String,
    surname: String,
    gender: Gender,
    dateOfBirth: String,
    parents: Array(PersonId),
    partners: Array(PersonId),
    optionalParents: Array(PersonId)
});
