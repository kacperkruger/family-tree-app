import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import {PersonResponse} from '../models/PersonResponse';
import parsePerson from '../utils/parsePerson';
import {Static} from 'runtypes';
import createOptionalChildRelationship from '../queries/createOptionalChildRelationship';

const addOptionalChildRelationship = async (childId: string, parentId: string): Promise<Static<typeof PersonResponse>> => {
    const session = await connectToNeo4jOrGetDriver();

    const result = session.run(createOptionalChildRelationship, {
        childId,
        parentId
    });

    return result.then(resultQuery => {
        const records = resultQuery.records;
        if (!records.length) throw new Error('User(s) not found');
        return records.map(record => parsePerson(record))[0];
    }).finally(() => session.close());
};

export default addOptionalChildRelationship;