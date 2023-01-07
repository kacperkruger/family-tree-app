import connectToNeo4j from '../utils/connectToNeo4j';
import parsePerson from '../utils/parsePerson';
import deleteChildFromParent from '../queries/deleteChildFromParent';
import {Person} from '../models/Person';

const deleteChildRelationship = async (parentId: string, childId: string): Promise<Person> => {
    const session = await connectToNeo4j();

    const result = session.run(deleteChildFromParent, {
        childId,
        parentId
    });

    return result.then(queryResult => {
        const records = queryResult.records;
        if (!records.length) throw new Error('Persons or relationships do not exist');
        return records.map(record => parsePerson(record))[0];
    }).finally(() => session.close());
};

export default deleteChildRelationship;