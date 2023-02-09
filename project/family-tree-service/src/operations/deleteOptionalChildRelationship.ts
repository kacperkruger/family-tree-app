import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import parsePerson from '../utils/parsePerson';
import {PersonResponse} from '../models/PersonResponse';
import {Static} from 'runtypes';
import removeOptionalChildRelationship from '../queries/removeOptionalChildRelationship';

const deleteOptionalChildRelationship = async (parentId: string, childId: string): Promise<Static<typeof PersonResponse>> => {
    const session = await connectToNeo4jOrGetDriver();

    const result = session.run(removeOptionalChildRelationship, {
        childId,
        parentId
    });

    return result.then(queryResult => {
        const records = queryResult.records;
        if (!records.length) throw new Error('Persons or relationships do not exist');
        return records.map(record => parsePerson(record))[0];
    }).finally(() => session.close());
};

export default deleteOptionalChildRelationship;