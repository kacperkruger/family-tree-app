import {UserDetails} from './domain/UserDetails';
import axios from 'axios';

const getUserDetails = async (id: string): Promise<UserDetails> => {
    const userHostURL = process.env.USER_SERVICE_HOST_URL;
    const response = await axios.get(`${userHostURL}/api/v1/users/${id}/details`);
    return response.data.user;
};

export default getUserDetails;