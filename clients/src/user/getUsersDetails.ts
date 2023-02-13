import {UserDetails} from './domain/UserDetails';
import axios from 'axios';

const getUsersDetails = async (ids: string[]): Promise<UserDetails[]> => {
    const userHostURL = process.env.USER_SERVICE_HOST_URL;
    const requestIds = ids.map(id => `id=${id}`).join('&');
    const response = await axios.get(`${userHostURL}/api/v1/users?${requestIds}`);
    return response.data.users;
};

export default getUsersDetails;