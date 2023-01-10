import {UserSensitiveData} from './domain/UserSensitiveData';
import axios from 'axios';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';

const getUserSensitiveData = async (username: string): Promise<UserSensitiveData> => {
    const userHostURL = process.env.USER_SERVICE_HOST_URL;
    try {
        const response = await axios.get(`${userHostURL}/api/v1/users/username:${username}/sensitive-data`);
        return response.data.user;
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        throw new Error(errorMessage);
    }
};

export default getUserSensitiveData;