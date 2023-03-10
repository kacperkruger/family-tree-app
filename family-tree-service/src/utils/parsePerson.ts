import {PersonResponse} from '../models/PersonResponse';
import {Record} from 'neo4j-driver';
import {Static} from 'runtypes';

const parsePerson = (record: Record): Static<typeof PersonResponse> => {
    return {
        id: record.get('id'),
        name: record.get('name'),
        surname: record.get('surname'),
        gender: record.get('gender'),
        dateOfBirth: new Date(record.get('dateOfBirth')).toISOString().split('T')[0],
        parents: record.get('parents'),
        partners: record.get('partners'),
        optionalParents: record.get('optionalParents')
    };
};

export default parsePerson;