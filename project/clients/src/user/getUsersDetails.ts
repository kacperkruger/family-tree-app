import {UserDetails} from './domain/UserDetails';
import axios from 'axios';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';

const getUsersDetails = async (ids: string[]): Promise<UserDetails[]> => {
    const userHostURL = process.env.USER_SERVICE_HOST_URL;
    const requestIds = ids.map(id => `id=${id}`).join('&');
    console.log(userHostURL + requestIds);
    try {
        const response = await axios.get(`${userHostURL}/api/v1/users?${requestIds}`);
        return response.data.users;
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        throw new Error(errorMessage);
    }
};

export default getUsersDetails;