import deletePerson from '../queries/deletePerson';
import connectToNeo4j from '../utils/connectToNeo4j';
import checkIfUserHasAccessToPerson from './checkIfUserHasAccessToPerson';

const removePerson = async (userId: string, personId: string): Promise<void> => {
    const session = await connectToNeo4j();

    try {
        const hasAccess = await checkIfUserHasAccessToPerson(userId, personId);
        if (!hasAccess) throw new Error('Unauthorized User Access');

        const result = session.run(deletePerson, {
            userId,
            personId
        });
        return result.then(queryResult => {
            if (!queryResult.summary.updateStatistics.updates().nodesDeleted) throw new Error('Internal server error');
            return;
        }).finally(() => session.close);
    } catch (e) {
        throw e;
    }
};

export default removePerson;