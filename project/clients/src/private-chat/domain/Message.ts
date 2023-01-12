import {Types} from 'mongoose';
import {UserDetails} from '@kacperkruger/clients/dist/user';

export interface Message {
    user: UserDetails | Types.ObjectId,
    text: string
}