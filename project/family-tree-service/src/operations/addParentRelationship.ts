import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import addParentToPerson from '../queries/addParentToPerson';
import {Person} from '../models/Person';
import parsePerson from '../utils/parsePerson';

const addParentRelationship = async (childId: string, parentId: string): Promise<Person> => {
    const session = await connectToNeo4jOrGetDriver();

    const result = session.run(addParentToPerson, {
        childId,
        parentId
    });

    return result.then(resultQuery => {
        const records = resultQuery.records;
        if (!records.length) throw new Error('User(s) not found');
        return records.map(record => parsePerson(record))[0];
    }).finally(() => session.close());
};

export default addParentRelationship;