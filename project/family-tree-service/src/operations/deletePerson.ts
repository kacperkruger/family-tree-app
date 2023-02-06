import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import removePerson from '../queries/removePerson';

const deletePerson = async (personId: string): Promise<void> => {
    const session = await connectToNeo4jOrGetDriver();

    const result = session.run(removePerson, {
        personId
    });

    return result.then(queryResult => {
        if (!queryResult.summary.updateStatistics.updates().nodesDeleted) throw new Error('Internal server error');
        return;
    }).finally(() => session.close);
};

export default deletePerson;