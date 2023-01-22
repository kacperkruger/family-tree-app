import getPerson from './getPerson';
import addPerson from './addPerson';
import addChild from './addChild';
import {PersonResponse} from '../models/PersonResponse';
import {Static} from 'runtypes';

const copyPersonToUsersTree = async (userId: string, personId: string, nGenerations: number): Promise<Static<typeof PersonResponse>[]> => {
    const copiedPersons: Static<typeof PersonResponse>[] = [];

    const copyPersonHelper = async (userId: string, personId: string, nGenerations: number, childId: string = ''): Promise<void> => {
        try {
            const person = await getPerson(personId);
            const addedPerson = await addPerson(userId, {
                name: person.name,
                surname: person.surname,
                gender: person.gender,
                dateOfBirth: person.dateOfBirth
            });
            if (childId !== '') {
                const child = await addChild(userId, addedPerson.id, childId);
                copiedPersons.push(child);
            }
            if (nGenerations === 0) {
                copiedPersons.push(addedPerson);
                return;
            }
            for (const parent of person.parents) {
                await copyPersonHelper(userId, parent, nGenerations - 1, addedPerson.id);
            }
        } catch (e) {
            throw e;
        }
    };

    await copyPersonHelper(userId, personId, nGenerations);
    return copiedPersons;
};

export default copyPersonToUsersTree;

