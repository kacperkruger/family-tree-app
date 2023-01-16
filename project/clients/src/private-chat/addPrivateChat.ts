import {PrivateChat} from './domain/PrivateChat';
import axios from 'axios';
import {PrivateChatRequest} from './domain/PrivateChatRequest';

const addPrivateChat = async (request: PrivateChatRequest): Promise<PrivateChat> => {
    const privateChatHostURL = process.env.PRIVATE_CHAT_SERVICE_HOST_URL;
    const response = await axios.post(`${privateChatHostURL}/api/v1/chats/private/`, request);
    return response.data.privateChat;
};

export default addPrivateChat;