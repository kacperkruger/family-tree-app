import {UserDetails} from '@kacperkruger/clients/user';
import {MessageResponse} from './MessageResponse';

export interface PrivateChatResponse {
    _id: string,
    users: UserDetails[],
    messages: MessageResponse[]
}