import {Message} from '@kacperkruger/clients/private-chat';
import {MessageResponse} from '../domain/chat/public/MessageResponse';
import {getUsersDetails, UserDetails} from '@kacperkruger/clients/user';

const populatePublicChat = async (messages: Message[]): Promise<MessageResponse[]> => {
    const usersToFetch = [...new Set(messages.map(message => message.user))];

    const users = await getUsersDetails(usersToFetch);
    const userMap = new Map<string, UserDetails>();
    users.forEach(user => userMap.set(user._id, user));

    return messages.map(message => {
        const userDetails = userMap.get(message.user);
        if (userDetails === undefined) throw new Error('User not found');
        return {
            _id: message._id,
            user: userDetails,
            text: message.text
        };
    });
};

export default populatePublicChat;