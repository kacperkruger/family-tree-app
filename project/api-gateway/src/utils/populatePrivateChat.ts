import {getUsersDetails, UserDetails} from '@kacperkruger/clients/user';
import {PrivateChatResponse} from '../domain/PrivateChatResponse';
import {PrivateChat} from '@kacperkruger/clients/private-chat';

const populatePrivateChat = async (privateChat: PrivateChat): Promise<PrivateChatResponse> => {
    const usersToFetch = [...new Set(privateChat.messages.map(message => message.user).concat(privateChat.users))];

    const users = await getUsersDetails(usersToFetch);
    const userMap = new Map<string, UserDetails>();
    users.forEach(user => userMap.set(user._id, user));

    return {
        _id: privateChat._id,
        users: privateChat.users.map(user => {
            const userDetails = userMap.get(user);
            if (userDetails === undefined) throw new Error('User not found');
            return userDetails;
        }),
        messages: privateChat.messages.map(message => {
                const userDetails = userMap.get(message.user);
                if (userDetails === undefined) throw new Error('User not found');
                return {
                    user: userDetails,
                    text: message.text
                };
            }
        )
    };
};

export default populatePrivateChat;