import {PrivateChat} from './domain/PrivateChat';
import axios from 'axios';

const addUserToPrivateChat = async (chatId: string, userId: string, userToAdd: string): Promise<PrivateChat> => {
    const privateChatHostURL = process.env.PRIVATE_CHAT_SERVICE_HOST_URL;
    const response = await axios.post(`${privateChatHostURL}/api/v1/chats/private/${chatId}/users`, {
        userId,
        userToAdd
    });
    return response.data.privateChat;
};

export default addUserToPrivateChat;