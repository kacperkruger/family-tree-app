import {Message} from './Message';

export interface PrivateChat {
    _id: string,
    users: string[],
    messages: Message[]
}