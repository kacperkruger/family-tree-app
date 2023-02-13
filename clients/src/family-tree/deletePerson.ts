import axios from 'axios';

const deletePerson = async (userId: string, personId: string): Promise<void> => {
    const familyTreeHostURL = process.env.FAMILY_TREE_SERVICE_HOST_URL;
    await axios.delete(`${familyTreeHostURL}/api/v1/family-trees/users/${userId}/persons/${personId}`);
};

export default deletePerson;