import axios from 'axios';

const deletePartnership = async (userId: string, partner1Id: string, partner2Id: string): Promise<void> => {
    const familyTreeHostURL = process.env.FAMILY_TREE_SERVICE_HOST_URL;
    const response = await axios.delete(`${familyTreeHostURL}/api/v1/family-trees/users/${userId}/relationship/partners/${partner1Id}/partners/${partner2Id}`);
};

export default deletePartnership;