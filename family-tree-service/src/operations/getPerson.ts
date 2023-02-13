import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import findPersonById from '../queries/findPersonById';
import parsePerson from '../utils/parsePerson';
import {PersonResponse} from '../models/PersonResponse';
import {Static} from 'runtypes';

const getPerson = async (personId: string): Promise<Static<typeof PersonResponse>> => {
    const session = await connectToNeo4jOrGetDriver();
    const result = session.run(findPersonById, {personId});

    return result.then(result => {
        if (!result.records.length) throw new Error('Person does not exists');
        return result.records.map(record => parsePerson(record))[0];
    }).finally(() => session.close);
};

export default getPerson;