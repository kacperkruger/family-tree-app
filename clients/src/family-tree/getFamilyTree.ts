import axios from 'axios';
import {PersonResponse} from './domain/PersonResponse';

const getFamilyTree = async (userId: string): Promise<PersonResponse[]> => {
    const familyTreeHostURL = process.env.FAMILY_TREE_SERVICE_HOST_URL;
    const response = await axios.get(`${familyTreeHostURL}/api/v1/family-trees/users/${userId}`);
    return response.data.familyTree;
};

export default getFamilyTree;