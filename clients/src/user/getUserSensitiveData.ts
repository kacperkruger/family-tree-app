import {UserSensitiveData} from './domain/UserSensitiveData';
import axios from 'axios';

const getUserSensitiveData = async (username: string): Promise<UserSensitiveData> => {
    const userHostURL = process.env.USER_SERVICE_HOST_URL;
    const response = await axios.get(`${userHostURL}/api/v1/users/username/${username}/sensitive-data`);
    return response.data.user;
};

export default getUserSensitiveData;