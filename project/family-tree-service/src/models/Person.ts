import {Gender} from './Gender';

export interface Person {
    id: string,
    name: string,
    surname: string,
    gender: Gender,
    dateOfBirth: string,
    parents: string[],
    partners: string[]
}
