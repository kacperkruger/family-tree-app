import {Gender} from '../routes/models/Gender';

export interface PersonRequest {
    name: string,
    surname: string,
    gender: Gender,
    dateOfBirth: string
}