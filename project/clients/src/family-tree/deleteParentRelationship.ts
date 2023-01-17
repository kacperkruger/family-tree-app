import axios from 'axios';

const deleteParentRelationship = async (userId: string, childId: string, parentId: string): Promise<void> => {
    const familyTreeHostURL = process.env.FAMILY_TREE_SERVICE_HOST_URL;
    await axios.delete(`${familyTreeHostURL}/api/v1/family-trees/users/${userId}/relationships/parents/children/${childId}/parents/${parentId}`);
};

export default deleteParentRelationship;