import connectToNeo4j from '../utils/connectToNeo4j';
import findFamilyTreeByUser from '../queries/findFamilyTreeByUser';
import {Person} from '../models/Person';
import parsePerson from '../utils/parsePerson';

const getFamilyTree = async (userId: string): Promise<Person[]> => {
    const session = await connectToNeo4j();
    const result = session.run(findFamilyTreeByUser, {userId});

    return result.then(queryResult => {
        return queryResult.records.map(record => parsePerson(record));
    }).finally(() => session.close);
};

export default getFamilyTree;