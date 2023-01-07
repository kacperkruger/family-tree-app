import connectToNeo4j from '../utils/connectToNeo4j';
import {Person} from '../models/Person';
import parsePerson from '../utils/parsePerson';
import addPartner from '../queries/addPartner';

const addPartnerRelationship = async (partner1Id: string, partner2Id: string): Promise<Person> => {
    const session = await connectToNeo4j();

    const result = session.run(addPartner, {
        partner1Id,
        partner2Id
    });

    return result.then(resultQuery => {
        const records = resultQuery.records;
        if (!records.length) throw new Error('User(s) not found');
        return records.map(record => parsePerson(record))[0];
    }).finally(() => session.close());
};

export default addPartnerRelationship;