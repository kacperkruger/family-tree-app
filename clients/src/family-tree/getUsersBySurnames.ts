import axios from 'axios';

const getUsersBySurnames = async (surnames: string[]): Promise<string[]> => {
    const familyTreeHostURL = process.env.FAMILY_TREE_SERVICE_HOST_URL;
    const response = await axios.get(`${familyTreeHostURL}/api/v1/family-trees/users?${surnames.map(surname => `surname=${surname}`).join('&')}`);
    return response.data.userIds;
};

export default getUsersBySurnames;