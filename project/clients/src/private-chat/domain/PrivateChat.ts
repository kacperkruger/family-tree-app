import {UserDetails} from '../../user';
import {Message} from './Message';

export interface PrivateChat {
    users: UserDetails[],
    messages: Message[]
}