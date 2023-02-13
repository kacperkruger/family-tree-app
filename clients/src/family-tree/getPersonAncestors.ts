import axios from 'axios';
import {PersonResponse} from './domain/PersonResponse';

const getPersonAncestors = async (personId: string): Promise<PersonResponse[]> => {
    const familyTreeHostURL = process.env.FAMILY_TREE_SERVICE_HOST_URL;
    const response = await axios.get(`${familyTreeHostURL}/api/v1/family-trees/persons/${personId}/ancestors`);
    return response.data.familyTree;
};

export default getPersonAncestors;