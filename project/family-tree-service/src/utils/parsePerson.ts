import {Person} from '../routes/models/Person';
import {Record} from 'neo4j-driver';

const parsePerson = (record: Record): Person => {
    return {
        id: record.get('id'),
        name: record.get('name'),
        surname: record.get('surname'),
        gender: record.get('gender'),
        dateOfBirth: new Date(record.get('dateOfBirth')).toISOString().split('T')[0],
        parents: record.get('parents'),
        partners: record.get('partners')
    };
};

export default parsePerson;