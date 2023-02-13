import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import ifHaveChild from '../queries/ifHaveChild';

const checkIfHaveKids = async (person1Id: string, person2Id: string): Promise<boolean> => {
    const session = await connectToNeo4jOrGetDriver();

    const result = session.run(ifHaveChild, {
        person1Id,
        person2Id
    });

    return result.then(queryResult => {
        if (!queryResult.records.length) throw new Error('Person not found');
        return queryResult.records[0].get('ifHaveChild');
    }).finally(() => session.close());
};

export default checkIfHaveKids;