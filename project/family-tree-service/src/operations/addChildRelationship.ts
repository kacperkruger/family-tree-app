import {PersonResponse} from '../models/PersonResponse';
import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import parsePerson from '../utils/parsePerson';
import {Static} from 'runtypes';
import createChildRelationship from '../queries/createChildRelationship';

const addChildRelationship = async (parentId: string, childId: string): Promise<Static<typeof PersonResponse>> => {
    const session = await connectToNeo4jOrGetDriver();
    const result = session.run(createChildRelationship, {
        parentId,
        childId
    });

    return result.then(result => {
        return result.records.map(record => parsePerson(record))[0];
    }).finally(() => session.close);
};

export default addChildRelationship;