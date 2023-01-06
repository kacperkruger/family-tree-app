import createPersonAndAddToUserFamilyTree from '../queries/createPersonAndAddToUserFamilyTree';
import {Person} from '../models/Person';
import parsePerson from '../utils/parsePerson';
import connectToNeo4j from '../utils/connectToNeo4j';
import {PersonRequest} from '../requests/PersonRequest';

const addPerson = async (userId: string, personRequest: PersonRequest): Promise<Person> => {
    const session = await connectToNeo4j();
    const result = session.run(createPersonAndAddToUserFamilyTree, {
        userId,
        personRequest
    });

    return result.then(result => {
        return result.records.map(record => parsePerson(record))[0];
    }).finally(() => session.close);
};

export default addPerson;