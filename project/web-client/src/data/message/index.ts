import type {User} from "@/data/user";

export interface Message {
    _id: string,
    user: User,
    text: string
}