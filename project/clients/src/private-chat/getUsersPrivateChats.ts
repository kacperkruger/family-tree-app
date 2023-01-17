import {PrivateChat} from './domain/PrivateChat';
import axios from 'axios';

const getUsersPrivateChats = async (users: string[]): Promise<PrivateChat[]> => {
    const privateChatHostURL = process.env.PRIVATE_CHAT_SERVICE_HOST_URL;
    const response = await axios.get(`${privateChatHostURL}/api/v1/chats/private?${users.map(user => `userId=${user}`).join('&')}`);
    return response.data.privateChats;
};

export default getUsersPrivateChats;