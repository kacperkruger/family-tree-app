import connectToNeo4j from '../utils/connectToNeo4j';
import {Person} from '../models/Person';
import parsePerson from '../utils/parsePerson';
import {PersonRequest} from '../requests/PersonRequest';
import editPerson from '../queries/editPerson';

const updatePerson = async (personId: string, personRequest: PersonRequest): Promise<Person> => {
    const session = await connectToNeo4j();

    const result = session.run(editPerson, {
        personId,
        name: personRequest.name,
        surname: personRequest.surname,
        gender: personRequest.gender,
        dateOfBirth: personRequest.dateOfBirth
    });

    return result.then(queryResult => {
        return queryResult.records.map(record => parsePerson(record))[0];
    }).finally(() => session.close());
};

export default updatePerson;