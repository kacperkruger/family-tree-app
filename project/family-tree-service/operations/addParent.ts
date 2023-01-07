import connectToNeo4j from '../utils/connectToNeo4j';
import addParentToPerson from '../queries/addParentToPerson';
import {Person} from '../models/Person';
import parsePerson from '../utils/parsePerson';

const addParent = async (childId: string, parentId: string): Promise<Person[]> => {
    const session = await connectToNeo4j();

    const result = session.run(addParentToPerson, {
        childId,
        parentId
    });

    return result.then(resultQuery => {
        const records = resultQuery.records;
        if (!records.length) throw new Error('User(s) not found');
        return records.map(record => parsePerson(record));
    }).finally(() => session.close());
};

export default addParent;