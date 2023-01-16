import {UserDetails} from '../../user';

export interface Message {
    user: UserDetails,
    text: string
}