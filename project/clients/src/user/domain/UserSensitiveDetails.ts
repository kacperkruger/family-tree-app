import {UserDetails} from './UserDetails';

export interface UserSensitiveDetails extends UserDetails {
    password: string;
}