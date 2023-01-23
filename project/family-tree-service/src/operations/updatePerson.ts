import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import {PersonResponse} from '../models/PersonResponse';
import parsePerson from '../utils/parsePerson';
import {PersonRequest} from '../models/PersonRequest';
import editPerson from '../queries/editPerson';
import {Static} from 'runtypes';

const updatePerson = async (personId: string, personRequest: Static<typeof PersonRequest>): Promise<Static<typeof PersonResponse>> => {
    const session = await connectToNeo4jOrGetDriver();

    const result = session.run(editPerson, {
        personId,
        name: personRequest.name,
        surname: personRequest.surname,
        gender: personRequest.gender.toUpperCase(),
        dateOfBirth: personRequest.dateOfBirth
    });

    return result.then(queryResult => {
        const records = queryResult.records;
        if (!records.length) throw new Error('PersonResponse not found');
        return records.map(record => parsePerson(record))[0];
    }).finally(() => session.close());
};

export default updatePerson;