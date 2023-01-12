import {UserDetails} from '@kacperkruger/clients/dist/user';
import {Message} from './Message';

export interface PrivateChatResponse {
    users: UserDetails[],
    messages: Message[]
}