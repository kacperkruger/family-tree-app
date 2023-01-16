import {Message} from './Message';

export interface PrivateChat {
    users: string[],
    messages: Message[]
}