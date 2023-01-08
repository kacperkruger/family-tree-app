import connectToNeo4j from '../utils/connectToNeo4j';
import findUsersWhoContainSurname from '../queries/findUsersWhoContainSurname';

const getUserIdsBySurnames = async (surnames: string[]): Promise<string[]> => {
    const session = await connectToNeo4j();
    const result = session.run(findUsersWhoContainSurname, {listOfSurname: surnames});

    return result.then(queryResult => {
        return queryResult.records.map(record => record.get('userId'));
    });
};

export default getUserIdsBySurnames;