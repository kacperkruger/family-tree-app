import {PrivateChat} from './domain/PrivateChat';
import axios from 'axios';

const getPrivateChat = async (id: string): Promise<PrivateChat> => {
    const privateChatHostURL = process.env.PRIVATE_CHAT_SERVICE_HOST_URL;
    const response = await axios.get(`${privateChatHostURL}/api/v1/chats/private/${id}`);
    return response.data.privateChat;
};

export default getPrivateChat;