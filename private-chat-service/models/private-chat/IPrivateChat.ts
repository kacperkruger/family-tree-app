import {Types} from 'mongoose';

export interface IPrivateChat {
    users: [Types.ObjectId],
    messages: [Types.ObjectId]
}