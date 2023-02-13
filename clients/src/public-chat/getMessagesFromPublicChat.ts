import {Message} from './domain/Message';
import axios from 'axios';

const getMessagesFromPublicChat = async (): Promise<Message[]> => {
    const publicChatHostURL = process.env.PUBLIC_CHAT_SERVICE_HOST_URL;
    const response = await axios.get(`${publicChatHostURL}/api/v1/chats/public/messages`);
    return response.data.messages;
};

export default getMessagesFromPublicChat;