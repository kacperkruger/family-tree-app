import {Message} from './domain/Message';
import axios from 'axios';
import {MessageRequest} from './domain/MessageRequest';

const addMessageToPublicChat = async (message: MessageRequest): Promise<Message> => {
    const publicChatHostURL = process.env.PUBLIC_CHAT_SERVICE_HOST_URL;
    const response = await axios.post(`${publicChatHostURL}/api/v1/chats/public/messages`, message);
    return response.data.message;
};

export default addMessageToPublicChat;