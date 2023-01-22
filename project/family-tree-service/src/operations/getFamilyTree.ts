import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import findFamilyTreeByUser from '../queries/findFamilyTreeByUser';
import {PersonResponse} from '../models/PersonResponse';
import parsePerson from '../utils/parsePerson';
import {Static} from 'runtypes';

const getFamilyTree = async (userId: string): Promise<Static<typeof PersonResponse>[]> => {
    const session = await connectToNeo4jOrGetDriver();
    const result = session.run(findFamilyTreeByUser, {userId});

    return result.then(queryResult => {
        return queryResult.records.map(record => parsePerson(record));
    }).finally(() => session.close);
};

export default getFamilyTree;