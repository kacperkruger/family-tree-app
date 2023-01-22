import {PersonResponse} from '../models/PersonResponse';
import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import parsePerson from '../utils/parsePerson';
import addChildToPerson from '../queries/addChildToPerson';
import {Static} from 'runtypes';

const addChild = async (userId: string, parentId: string, childId: string): Promise<Static<typeof PersonResponse>> => {
    const session = await connectToNeo4jOrGetDriver();
    const result = session.run(addChildToPerson, {
        userId,
        personId: parentId,
        childId
    });

    return result.then(result => {
        return result.records.map(record => parsePerson(record))[0];
    }).finally(() => session.close);
};

export default addChild;