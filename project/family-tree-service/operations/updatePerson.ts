import connectToNeo4j from '../utils/connectToNeo4j';
import {Person} from '../models/Person';
import parsePerson from '../utils/parsePerson';
import {PersonRequest} from '../requests/PersonRequest';
import editPerson from '../queries/editPerson';
import checkIfUserHasAccessToPerson from './checkIfUserHasAccessToPerson';

const updatePerson = async (userId: string, personId: string, personRequest: PersonRequest): Promise<Person> => {
    const session = await connectToNeo4j();

    try {
        const hasAccess = await checkIfUserHasAccessToPerson(userId, personId);
        if (!hasAccess) throw new Error('Not Authorized Access');

        const result = session.run(editPerson, {
            userId,
            personId,
            name: personRequest.name,
            surname: personRequest.surname,
            gender: personRequest.gender,
            dateOfBirth: personRequest.dateOfBirth
        });

        return result.then(queryResult => {
            return queryResult.records.map(record => parsePerson(record))[0];
        }).finally(() => session.close());
    } catch (e) {
        throw e;
    }
};

export default updatePerson;