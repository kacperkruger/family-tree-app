import {UserDetails} from '@kacperkruger/clients/user';

export interface MessageResponse {
    _id: string,
    user: UserDetails,
    text: string
}