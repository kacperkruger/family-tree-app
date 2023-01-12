import {Person} from '../models/Person';
import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import parsePerson from '../utils/parsePerson';
import deletePartner from '../queries/deletePartner';

const deletePartnerRelationship = async (partner1Id: string, partner2Id: string): Promise<Person[]> => {
    const session = await connectToNeo4jOrGetDriver();

    const result = session.run(deletePartner, {
        partner1Id,
        partner2Id
    });

    return result.then(resultQuery => {
        const records = resultQuery.records;
        if (!records.length) throw new Error('User(s)/Relationship not found');
        return records.map(record => parsePerson(record));
    }).finally(() => session.close());
};

export default deletePartnerRelationship;