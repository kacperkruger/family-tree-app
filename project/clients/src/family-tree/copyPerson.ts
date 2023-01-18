import axios from 'axios';
import {PersonResponse} from './domain/PersonResponse';

const copyPerson = async (userId: string, personId: string, nGenerations: number = 0): Promise<PersonResponse[]> => {
    const familyTreeHostURL = process.env.FAMILY_TREE_SERVICE_HOST_URL;
    const response = await axios.post(`${familyTreeHostURL}/api/v1/family-trees/users/${userId}/persons/${personId}?n=${nGenerations}`);
    return response.data.persons;
};

export default copyPerson;