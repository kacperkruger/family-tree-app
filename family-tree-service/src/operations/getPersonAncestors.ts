import {Static} from 'runtypes';
import {PersonResponse} from '../models/PersonResponse';
import getPerson from './getPerson';

const getPersonAncestors = async (personId: string): Promise<Static<typeof PersonResponse>[]> => {
    let personAncestors: Static<typeof PersonResponse>[] = [];
    const addOrReplacePerson = (person: Static<typeof PersonResponse>): void => {
        personAncestors = personAncestors.filter(personAncestors => personAncestors.id !== person.id);
        personAncestors.push(person);
    };

    const getPersonAncestorsHelper = async (personId: string) => {
        const person = await getPerson(personId);
        addOrReplacePerson(person);
        for (const parentId of person.parents) {
            await getPersonAncestorsHelper(parentId);
        }
        for (const optionalParentId of person.optionalParents) {
            await getPersonAncestorsHelper(optionalParentId);
        }
    };
    await getPersonAncestorsHelper(personId);
    return personAncestors;
};

export default getPersonAncestors;