import axios from 'axios';
import {PersonResponse} from './domain/PersonResponse';
import {UpdatePersonRequest} from './domain/UpdatePersonRequest';

const editPerson = async (userId: string, personId: string, person: UpdatePersonRequest): Promise<PersonResponse> => {
    const familyTreeHostURL = process.env.FAMILY_TREE_SERVICE_HOST_URL;
    const response = await axios.put(`${familyTreeHostURL}/api/v1/family-trees/users/${userId}/persons/${personId}`, person);
    return response.data.persons;
};

export default editPerson;