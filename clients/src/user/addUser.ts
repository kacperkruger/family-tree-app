import {UserRequest} from './domain/UserRequest';
import {UserDetails} from './domain/UserDetails';
import axios from 'axios';

const addUser = async (request: UserRequest): Promise<UserDetails> => {
    const userHostURL = process.env.USER_SERVICE_HOST_URL;
    const response = await axios.post(`${userHostURL}/api/v1/users`, request);
    return response.data.user;
};

export default addUser;