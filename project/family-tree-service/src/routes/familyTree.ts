import express, {Request, Response, Router} from 'express';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';
import copyPersonToUsersTree from '../operations/copyPersonToUsersTree';
import getFamilyTree from '../operations/getFamilyTree';
import addPerson from '../operations/addPerson';
import updatePerson from '../operations/updatePerson';
import removePerson from '../operations/removePerson';
import checkIfUserHasAccessToPerson from '../operations/checkIfUserHasAccessToPerson';
import addParentRelationship from '../operations/addParentRelationship';
import deleteChildRelationship from '../operations/deleteChildRelationship';
import addPartnerRelationship from '../operations/addPartnerRelationship';
import deletePartnerRelationship from '../operations/deletePartnerRelationship';
import getUsersBySurnames from '../operations/getUsersBySurnames';
import {PersonRequest} from '../models/PersonRequest';
import getUsersBySurnamesWithDateOfBirth from '../operations/getUsersBySurnamesWithDateOfBirth';
import checkIfPersonAndChildsParentArePartners from '../operations/checkIfPersonAndChildsParentArePartners';
import checkIfHaveKids from '../operations/checkIfHaveKids';
import deleteOptionalChildRelationship from '../operations/deleteOptionalChildRelationship';
import addOptionalChildRelationship from '../operations/addOptionalChildRelationship';

const router: Router = express.Router();

router.get('/users', async (req: Request<{}, {}, {}, { surname: string[] | string | undefined, dateOfBirth: string | undefined }>, res: Response): Promise<Response> => {
    let surnames = req.query.surname;
    const dateOfBirth = req.query.dateOfBirth;

    if (surnames) {
        if (typeof surnames === 'string') surnames = [surnames];
        try {
            if (dateOfBirth) {
                const userIds = await getUsersBySurnamesWithDateOfBirth(surnames, dateOfBirth);
                return res.json({userIds});
            }
            const userIds = await getUsersBySurnames(surnames);
            return res.json({userIds});
        } catch (e) {
            const errorMessage = parseErrorMessage(e);
            return res.status(400).json({error: errorMessage});
        }
    }
    return res.status(400).json({error: 'Surnames not included'});
});

router.get('/users/:userId', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId;
    try {
        const familyTree = await getFamilyTree(userId);
        return res.json({familyTree});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(500).json({error: errorMessage});
    }
});

router.post('/users/:userId/persons', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId;
    const data = req.body;

    try {
        const personRequest = PersonRequest.check(data);
        const addedPerson = await addPerson(userId, personRequest);
        return res.status(201).json({person: addedPerson});
    } catch (e) {
        console.log(e);
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.put('/users/:userId/persons/:personId', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId;
    const personId = req.params.personId;
    console.log(req.body);
    try {
        const personRequest = PersonRequest.check(req.body);

        const hasAccess = await checkIfUserHasAccessToPerson(userId, personId);
        if (!hasAccess) return res.sendStatus(405);

        const updatedPerson = await updatePerson(personId, personRequest);
        console.log(updatedPerson);
        return res.json({person: updatedPerson});
    } catch (e) {
        console.log(e);
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.delete('/users/:userId/persons/:personId', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId;
    const personId = req.params.personId;
    try {
        const hasAccess = await checkIfUserHasAccessToPerson(userId, personId);
        if (!hasAccess) return res.sendStatus(405);
        await removePerson(personId);
        return res.sendStatus(204);
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(404).json({error: errorMessage});
    }
});

router.post('/users/:userId/relationships/parents/:parentId/children/:childId', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId;
    const childId = req.params.childId;
    const parentId = req.params.parentId;

    try {
        const hasAccessToChild = await checkIfUserHasAccessToPerson(userId, childId);
        if (!hasAccessToChild) return res.sendStatus(405);

        const hasAccessToParent = await checkIfUserHasAccessToPerson(userId, parentId);
        if (!hasAccessToParent) return res.sendStatus(405);

        const ifParentsArePartners = await checkIfPersonAndChildsParentArePartners(childId, parentId);
        if (!ifParentsArePartners) return res.status(400).json({error: 'Parents are not partners'});

        const editedPerson = await addParentRelationship(childId, parentId);
        return res.json({person: editedPerson});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.delete('/users/:userId/relationships/parents/:parentId/children/:childId', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId;
    const childId = req.params.childId;
    const parentId = req.params.parentId;

    try {
        const hasAccessToChild = await checkIfUserHasAccessToPerson(userId, childId);
        if (!hasAccessToChild) return res.sendStatus(405);

        const hasAccessToParent = await checkIfUserHasAccessToPerson(userId, parentId);
        if (!hasAccessToParent) return res.sendStatus(405);

        const editedPerson = await deleteChildRelationship(parentId, childId);
        return res.json({person: editedPerson});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.post('/users/:userId/relationships/partners/:partner1Id/partners/:partner2Id', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId;
    const partner1Id = req.params.partner1Id;
    const partner2Id = req.params.partner2Id;

    try {
        const hasAccessToPartner1 = await checkIfUserHasAccessToPerson(userId, partner1Id);
        if (!hasAccessToPartner1) return res.sendStatus(405);

        const hasAccessToPartner2 = await checkIfUserHasAccessToPerson(userId, partner2Id);
        if (!hasAccessToPartner2) return res.sendStatus(405);

        const editedPersons = await addPartnerRelationship(partner1Id, partner2Id);
        return res.json({persons: editedPersons});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.delete('/users/:userId/relationships/partners/:partner1Id/partners/:partner2Id', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId;
    const partner1Id = req.params.partner1Id;
    const partner2Id = req.params.partner2Id;

    try {
        const hasAccessToPartner1 = await checkIfUserHasAccessToPerson(userId, partner1Id);
        if (!hasAccessToPartner1) return res.sendStatus(405);

        const hasAccessToPartner2 = await checkIfUserHasAccessToPerson(userId, partner2Id);
        if (!hasAccessToPartner2) return res.sendStatus(405);

        const ifHaveKids = await checkIfHaveKids(partner1Id, partner2Id);
        if (ifHaveKids) return res.status(400).json({error: 'Partners have kid/s'});

        const editedPersons = await deletePartnerRelationship(partner1Id, partner2Id);
        return res.json({persons: editedPersons});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.post('/users/:userId/relationships/optional/parents/:parentId/children/:childId', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId;
    const childId = req.params.childId;
    const parentId = req.params.parentId;

    try {
        const hasAccessToChild = await checkIfUserHasAccessToPerson(userId, childId);
        if (!hasAccessToChild) return res.sendStatus(405);

        const hasAccessToParent = await checkIfUserHasAccessToPerson(userId, parentId);
        if (!hasAccessToParent) return res.sendStatus(405);

        const editedPerson = await addOptionalChildRelationship(childId, parentId);
        return res.json({person: editedPerson});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.delete('/users/:userId/relationships/optional/parents/:parentId/children/:childId', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId;
    const childId = req.params.childId;
    const parentId = req.params.parentId;

    try {
        const hasAccessToChild = await checkIfUserHasAccessToPerson(userId, childId);
        if (!hasAccessToChild) return res.sendStatus(405);

        const hasAccessToParent = await checkIfUserHasAccessToPerson(userId, parentId);
        if (!hasAccessToParent) return res.sendStatus(405);

        const editedPerson = await deleteOptionalChildRelationship(parentId, childId);
        return res.json({person: editedPerson});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

router.post('/users/:userId/persons/:personId', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId;
    const personId = req.params.personId;
    const numberOfGenerations = req.query.n || 0;

    try {
        const copiedPersons = await copyPersonToUsersTree(userId, personId, +numberOfGenerations);
        return res.json({persons: copiedPersons});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        return res.status(400).json({error: errorMessage});
    }
});

export default router;