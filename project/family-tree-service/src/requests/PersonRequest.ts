import {Gender} from '../models/Gender';

export interface PersonRequest {
    name: string,
    surname: string,
    gender: Gender,
    dateOfBirth: string
}