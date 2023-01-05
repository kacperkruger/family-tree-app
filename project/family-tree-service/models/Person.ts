import {Gender} from './Gender';

export interface Person {
    id: string,
    name: string,
    surname: string,
    gender: Gender,
    dateOfBirth: String,
    parents: string[],
    partners: string[]
}
