import createPerson from '../queries/createPerson';
import {Person} from '../routes/models/Person';
import parsePerson from '../utils/parsePerson';
import connectToNeo4j from '../utils/connectToNeo4j';
import {PersonRequest} from '../requests/PersonRequest';

const addPerson = async (userId: string, personRequest: PersonRequest): Promise<Person> => {
    const session = await connectToNeo4j();
    const result = session.run(createPerson, {
        userId,
        name: personRequest.name,
        surname: personRequest.surname,
        gender: personRequest.gender,
        dateOfBirth: personRequest.dateOfBirth
    });

    return result.then(result => {
        return result.records.map(record => parsePerson(record))[0];
    }).finally(() => session.close);
};

export default addPerson;