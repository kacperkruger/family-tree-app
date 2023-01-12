import {Person} from '../models/Person';
import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import parsePerson from '../utils/parsePerson';
import addChildToPerson from '../queries/addChildToPerson';

const addChild = async (userId: string, parentId: string, childId: string): Promise<Person> => {
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