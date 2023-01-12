import deletePerson from '../queries/deletePerson';
import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';

const removePerson = async (personId: string): Promise<void> => {
    const session = await connectToNeo4jOrGetDriver();

    const result = session.run(deletePerson, {
        personId
    });

    return result.then(queryResult => {
        if (!queryResult.summary.updateStatistics.updates().nodesDeleted) throw new Error('Internal server error');
        return;
    }).finally(() => session.close);
};

export default removePerson;