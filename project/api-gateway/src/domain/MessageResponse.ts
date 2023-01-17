import {UserDetails} from '@kacperkruger/clients/user';

export interface MessageResponse {
    user: UserDetails,
    text: string
}