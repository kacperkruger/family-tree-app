import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import findUsersWhoContainSurnameWithDateOfBirth from '../queries/findUsersWhoContainSurnameWithDateOfBirth';

const getUserIdsBySurnamesWithDateOfBirth = async (surnames: string[], dateOfBirth: string): Promise<string[]> => {
    const session = await connectToNeo4jOrGetDriver();
    const result = session.run(findUsersWhoContainSurnameWithDateOfBirth, {listOfSurname: surnames, dateOfBirth});

    return result.then(queryResult => {
        return queryResult.records.map(record => record.get('userId'));
    });
};

export default getUserIdsBySurnamesWithDateOfBirth;