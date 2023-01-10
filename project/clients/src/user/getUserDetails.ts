import {UserDetails} from './domain/UserDetails';
import axios from 'axios';
import dotenv from 'dotenv';

const getUserDetails = async (id: string): Promise<UserDetails[]> => {
    dotenv.config();
    const userHostURL = process.env.USER_SERVICE_HOST_URL;
    try {
        const response = await axios.get(`${userHostURL}/api/v1/user/details/${id}`);
        return response.data.user;
    } catch (e) {
        console.log(e);
        throw new Error();
    }
};

export default getUserDetails;