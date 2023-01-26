import type {User} from "@/data/user";

export interface PrivateChat {
    _id: string,
    users: User[],
}