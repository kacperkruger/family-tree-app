import {Static} from 'runtypes';
import {PersonEditRequest} from '../models/PersonEditRequest';
import {PersonResponse} from '../models/PersonResponse';
import deletePartnerRelationship from './deletePartnerRelationship';
import addPartnerRelationship from './addPartnerRelationship';
import deleteChildRelationship from './deleteChildRelationship';
import addChildRelationship from './addChildRelationship';
import getPerson from './getPerson';
import patchPerson from './patchPerson';
import deleteOptionalChildRelationship from './deleteOptionalChildRelationship';
import addOptionalChildRelationship from './addOptionalChildRelationship';
import checkIfHaveKids from './checkIfHaveKids';

const updatePerson = async (personId: string, personEditRequest: Static<typeof PersonEditRequest>): Promise<Static<typeof PersonResponse>[]> => {
    let updatedPersons: Static<typeof PersonResponse>[] = [];

    const addOrReplaceUpdatedPerson = (person: Static<typeof PersonResponse>): void => {
        updatedPersons = updatedPersons.filter(updatedPerson => updatedPerson.id !== person.id);
        updatedPersons.push(person);
    };

    const personDetails = await getPerson(personId);
    addOrReplaceUpdatedPerson(await patchPerson(personId, personEditRequest));

    const partnersToDelete = personDetails.partners
        .filter(partnerId => !personEditRequest.partners.some(newPartnerId => newPartnerId === partnerId));
    const partnersToAdd = personEditRequest.partners
        .filter(newPartnerId =>
            !personDetails.partners.some(partnerId => partnerId === newPartnerId));

    const parentsToDelete = personDetails.parents
        .filter(parentId => !personEditRequest.parents.some(newParentId => newParentId === parentId));
    const parentsToAdd = personEditRequest.parents
        .filter(newParentId =>
            !personDetails.parents.some(parentId => parentId === newParentId));

    const optionalParentsToDelete = personDetails.optionalParents
        .filter(optionalParentId => !personEditRequest.optionalParents.some(newOptionalParentId => newOptionalParentId === optionalParentId));
    const optionalParentsToAdd = personEditRequest.optionalParents
        .filter(newOptionalParentId =>
            !personDetails.optionalParents.some(optionalParentId => optionalParentId === newOptionalParentId));

    for await (const partnerToDeleteId of partnersToDelete) {
        if (!await checkIfHaveKids(partnerToDeleteId, personId)) {
            const results = await deletePartnerRelationship(partnerToDeleteId, personId);
            results.forEach(person => addOrReplaceUpdatedPerson(person));
        } else {
            throw new Error('Persons have child');
        }
    }
    await Promise.all(partnersToAdd.map(async partnerToAddId => {
        const persons = await addPartnerRelationship(personId, partnerToAddId);
        persons.forEach(person => addOrReplaceUpdatedPerson(person));
    }));

    for await (const parentToDeleteId of parentsToDelete) {
        const result = await deleteChildRelationship(parentToDeleteId, personId);
        addOrReplaceUpdatedPerson(result);
    }
    await Promise.all(parentsToAdd.map(async parentToAddId => {
        const result = await addChildRelationship(parentToAddId, personId);
        addOrReplaceUpdatedPerson(result);
    }));

    for await (const optionalParentToDeleteId of optionalParentsToDelete) {
        const result = await deleteOptionalChildRelationship(optionalParentToDeleteId, personId);
        addOrReplaceUpdatedPerson(result);
    }
    await Promise.all(optionalParentsToAdd.map(async optionalParentToAddId => {
        addOrReplaceUpdatedPerson(await addOptionalChildRelationship(personId, optionalParentToAddId));
    }));

    return updatedPersons;
};

export default updatePerson;