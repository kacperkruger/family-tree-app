import axios from 'axios';
import {PersonResponse} from './domain/PersonResponse';

const addPartnership = async (userId: string, partner1Id: string, partner2Id: string): Promise<PersonResponse[]> => {
    const familyTreeHostURL = process.env.FAMILY_TREE_SERVICE_HOST_URL;
    const response = await axios.post(`${familyTreeHostURL}/api/v1/family-trees/users/${userId}/relationships/partners/${partner1Id}/partners/${partner2Id}`);
    return response.data.persons;
};

export default addPartnership;