import {PrivateChat} from './domain/PrivateChat';
import axios from 'axios';
import {MessageRequest} from './domain/MessageRequest';

const addMessageToPrivateChat = async (chatId: string, message: MessageRequest): Promise<PrivateChat> => {
    const privateChatHostURL = process.env.PRIVATE_CHAT_SERVICE_HOST_URL;
    const response = await axios.post(`${privateChatHostURL}/api/v1/chats/private/${chatId}/messages`, message);
    return response.data.privateChat;
};

export default addMessageToPrivateChat;