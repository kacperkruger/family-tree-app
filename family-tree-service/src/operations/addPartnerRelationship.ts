import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import {PersonResponse} from '../models/PersonResponse';
import parsePerson from '../utils/parsePerson';
import createPartnerRelationship from '../queries/createPartnerRelationship';
import {Static} from 'runtypes';

const addPartnerRelationship = async (partner1Id: string, partner2Id: string): Promise<Static<typeof PersonResponse>[]> => {
    const session = await connectToNeo4jOrGetDriver();

    const result = session.run(createPartnerRelationship, {
        partner1Id,
        partner2Id
    });

    return result.then(resultQuery => {
        const records = resultQuery.records;
        if (!records.length) throw new Error('User(s) not found');
        return records.map(record => parsePerson(record));
    }).finally(() => session.close());
};

export default addPartnerRelationship;