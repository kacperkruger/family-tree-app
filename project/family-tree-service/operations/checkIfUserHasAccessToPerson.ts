import connectToNeo4j from '../utils/connectToNeo4j';
import whetherUserHasAccessToPerson from '../queries/whetherUserHasAccessToPerson';

const checkIfUserHasAccessToPerson = async (userId: string, personId: string): Promise<boolean> => {
    const session = await connectToNeo4j();

    const result = session.run(whetherUserHasAccessToPerson, {
        userId,
        personId
    });

    return result.then(queryResult => {
        if (!queryResult.records.length) throw new Error('Person not found');
        return queryResult.records[0].get('hasAccess');
    }).finally(() => session.close());
};

export default checkIfUserHasAccessToPerson;