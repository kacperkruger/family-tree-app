import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import ifPersonAndChildParentArePartners from '../queries/ifPersonAndChildParentArePartners';

const checkIfPersonAndChildParentArePartners = async (childId: string, personId: string): Promise<boolean> => {
    const session = await connectToNeo4jOrGetDriver();

    const result = session.run(ifPersonAndChildParentArePartners, {
        childId,
        personId
    });

    return result.then(queryResult => {
        if (!queryResult.records.length) throw new Error('Person not found');
        return queryResult.records[0].get('ifParentsArePartners');
    }).finally(() => session.close());
};

export default checkIfPersonAndChildParentArePartners;