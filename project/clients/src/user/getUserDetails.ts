import {UserDetails} from './domain/UserDetails';
import axios from 'axios';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';

const getUserDetails = async (id: string): Promise<UserDetails> => {
    const userHostURL = process.env.USER_SERVICE_HOST_URL;
    try {
        const response = await axios.get(`${userHostURL}/api/v1/users/${id}/details`);
        return response.data.user;
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        throw new Error(errorMessage);
    }
};

export default getUserDetails;