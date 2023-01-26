import {MessageResponse} from './MessageResponse';

export interface PrivateChat {
    _id: string,
    users: string[],
    messages: MessageResponse[]
}