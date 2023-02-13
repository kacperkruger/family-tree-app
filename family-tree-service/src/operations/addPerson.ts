import createPerson from '../queries/createPerson';
import {PersonResponse} from '../models/PersonResponse';
import parsePerson from '../utils/parsePerson';
import connectToNeo4jOrGetDriver from '../utils/connectToNeo4jOrGetDriver';
import {Static} from 'runtypes';
import {PersonRequest} from '../models/PersonRequest';
import {Date as Neo4jDate} from 'neo4j-driver';


const addPerson = async (userId: string, personRequest: Static<typeof PersonRequest>): Promise<Static<typeof PersonResponse>> => {
    const session = await connectToNeo4jOrGetDriver();
    const result = session.run(createPerson, {
        userId,
        name: personRequest.name,
        surname: personRequest.surname || '',
        gender: personRequest.gender?.toUpperCase() || '',
        dateOfBirth: Neo4jDate.fromStandardDate(new Date(personRequest.dateOfBirth || 0))
    });

    return result.then(result => {
        return result.records.map(record => parsePerson(record))[0];
    }).finally(() => session.close);
};

export default addPerson;