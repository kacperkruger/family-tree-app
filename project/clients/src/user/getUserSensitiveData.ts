import {UserSensitiveData} from './domain/UserSensitiveData';
import dotenv from 'dotenv';
import axios from 'axios';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';

const getUserSensitiveData = async (id: string): Promise<UserSensitiveData> => {
    dotenv.config();
    const userHostURL = process.env.USER_SERVICE_HOST_URL;
    try {
        const response = await axios.get(`${userHostURL}/api/v1/user/sensitive/${id}`);
        return response.data.user;
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        throw new Error(errorMessage);
    }
};

export default getUserSensitiveData;