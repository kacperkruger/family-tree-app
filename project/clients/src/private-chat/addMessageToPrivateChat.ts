import axios from 'axios';
import {MessageRequest} from './domain/MessageRequest';
import {MessageResponse} from './domain/MessageResponse';

const addMessageToPrivateChat = async (chatId: string, message: MessageRequest): Promise<MessageResponse> => {
    const privateChatHostURL = process.env.PRIVATE_CHAT_SERVICE_HOST_URL;
    const response = await axios.post(`${privateChatHostURL}/api/v1/chats/private/${chatId}/messages`, message);
    return response.data.message;
};

export default addMessageToPrivateChat;