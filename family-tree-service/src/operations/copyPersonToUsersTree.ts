import getPerson from './getPerson';
import addPerson from './addPerson';
import addChildRelationship from './addChildRelationship';
import {PersonResponse} from '../models/PersonResponse';
import {Static} from 'runtypes';
import addPartnerRelationship from './addPartnerRelationship';

const copyPersonToUsersTree = async (userId: string, personId: string, nGenerations: number): Promise<Static<typeof PersonResponse>[]> => {
    let copiedPersons: Static<typeof PersonResponse>[] = [];

    const addOrReplaceCopiedPerson = (person: Static<typeof PersonResponse>): void => {
        copiedPersons = copiedPersons.filter(copiedPerson => copiedPerson?.id !== person?.id);
        copiedPersons.push(person);
    };
    const copyPersonHelper = async (userId: string, personId: string, nGenerations: number, childId: string = ''): Promise<void> => {
        const person = await getPerson(personId);
        const addedPerson = await addPerson(userId, {
            name: person.name,
            surname: person.surname,
            gender: person.gender,
            dateOfBirth: person.dateOfBirth
        });
        if (childId !== '') {
            const child = await addChildRelationship(addedPerson.id, childId);
            copiedPersons.push(child);
        }
        if (nGenerations === 0) {
            copiedPersons.push(addedPerson);
            return;
        }
        if (!person.parents.length) {
            copiedPersons.push(addedPerson);
            return;
        }

        for (const parent of person.parents) {
            await copyPersonHelper(userId, parent, nGenerations - 1, addedPerson.id);
        }
        const updatedPerson = await getPerson(addedPerson.id);
        if (updatedPerson.parents.length === 2) {
            const persons = await addPartnerRelationship(updatedPerson.parents[0], updatedPerson.parents[1]);
            persons.forEach(person => addOrReplaceCopiedPerson(person));
        }
    };

    await copyPersonHelper(userId, personId, nGenerations);
    return copiedPersons;
};

export default copyPersonToUsersTree;

