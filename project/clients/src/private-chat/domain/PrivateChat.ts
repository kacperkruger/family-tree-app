import {Types} from 'mongoose';

export interface PrivateChat {
    users: Types.ObjectId[],
    messages: Types.ObjectId[]
}