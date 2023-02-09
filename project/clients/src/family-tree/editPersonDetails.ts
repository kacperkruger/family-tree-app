import axios from 'axios';
import {PersonResponse} from './domain/PersonResponse';
import {EditPersonRequest} from './domain/EditPersonRequest';

const editPersonDetails = async (userId: string, personId: string, person: EditPersonRequest): Promise<PersonResponse> => {
    const familyTreeHostURL = process.env.FAMILY_TREE_SERVICE_HOST_URL;
    const response = await axios.patch(`${familyTreeHostURL}/api/v1/family-trees/users/${userId}/persons/${personId}`, person);
    return response.data.person;
};

export default editPersonDetails;