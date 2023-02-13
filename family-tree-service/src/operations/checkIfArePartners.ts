import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import ifArePartners from '../queries/ifArePartners';

const checkIfPersonAndChildParentArePartners = async (person1Id: string, person2Id: string): Promise<boolean> => {
    const session = await connectToNeo4jOrGetDriver();

    const result = session.run(ifArePartners, {
        person1Id,
        person2Id
    });

    return result.then(queryResult => {
        if (!queryResult.records.length) throw new Error('Person(s) not found');
        return queryResult.records[0].get('ifArePartners');
    }).finally(() => session.close());
};

export default checkIfPersonAndChildParentArePartners;