import {PersonRequest} from './domain/PersonRequest';
import axios from 'axios';
import {PersonResponse} from './domain/PersonResponse';

const addPerson = async (userId: string, person: PersonRequest): Promise<PersonResponse> => {
    const familyTreeHostURL = process.env.FAMILY_TREE_SERVICE_HOST_URL;
    const response = await axios.post(`${familyTreeHostURL}/api/v1/family-trees/users/${userId}/persons`, person);
    return response.data.person;
};

export default addPerson;