import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import findUsersWhoContainSurname from '../queries/findUsersWhoContainSurname';

const getUserIdsBySurnames = async (surnames: string[]): Promise<string[]> => {
    const session = await connectToNeo4jOrGetDriver();
    const result = session.run(findUsersWhoContainSurname, {listOfSurname: surnames});

    return result.then(queryResult => {
        return queryResult.records.map(record => record.get('userId'));
    });
};

export default getUserIdsBySurnames;