import axios from 'axios';
import {PersonResponse} from './domain/PersonResponse';

const deleteOptionalParentRelationship = async (userId: string, childId: string, parentId: string): Promise<PersonResponse> => {
    const familyTreeHostURL = process.env.FAMILY_TREE_SERVICE_HOST_URL;
    const response = await axios.delete(`${familyTreeHostURL}/api/v1/family-trees/users/${userId}/relationships/optional/parents/${parentId}/children/${childId}`);
    return response.data.person;
};

export default deleteOptionalParentRelationship;