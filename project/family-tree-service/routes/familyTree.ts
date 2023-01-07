import express, {Request, Response, Router} from 'express';
import parseErrorMessage from '../utils/parseErrorMessage';
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

const router: Router = express.Router();

router.get('/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const familyTree = await getFamilyTree(userId);
        res.json({familyTree});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        res.status(400).json({error: errorMessage});
    }
});

router.post('/:userId/person', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const data = req.body;
    try {
        const addedPerson = await addPerson(userId, {
            name: data.name || '',
            surname: data.surname || '',
            gender: data.gender || '',
            dateOfBirth: data.dateOfBirth || null
        });
        res.json({addedPerson});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        res.status(400).json({error: errorMessage});
    }
});

router.put('/:userId/person/:personId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const personId = req.params.personId;
    const data = req.body;

    try {
        const hasAccess = await checkIfUserHasAccessToPerson(userId, personId);
        if (!hasAccess) return res.sendStatus(401);

        const updatedPerson = await updatePerson(personId, {
            name: data.name,
            surname: data.surname,
            gender: data.gender,
            dateOfBirth: data.dateOfBirth
        });
        res.json({updatedPerson});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        res.status(400).json({error: errorMessage});
    }
});

router.delete('/:userId/person/:personId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const personId = req.params.personId;

    try {
        const hasAccess = await checkIfUserHasAccessToPerson(userId, personId);
        if (!hasAccess) return res.sendStatus(401);
        await removePerson(personId);
        res.sendStatus(200);
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        res.status(400).json({error: errorMessage});
    }
});

router.post('/:userId/relationship/parent', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const data = req.body;

    try {
        const childId = data.childId;
        const parentId = data.parentId;

        const hasAccessToChild = await checkIfUserHasAccessToPerson(userId, childId);
        if (!hasAccessToChild) return res.sendStatus(401);

        const hasAccessToParent = await checkIfUserHasAccessToPerson(userId, parentId);
        if (!hasAccessToParent) return res.sendStatus(401);

        const editedPerson = await addParentRelationship(childId, parentId);
        res.json({editedPerson});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        res.status(400).json({error: errorMessage});
    }
});

router.delete('/:userId/relationship/parent', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const data = req.body;

    try {
        const childId = data.childId;
        const parentId = data.parentId;

        const hasAccessToChild = await checkIfUserHasAccessToPerson(userId, childId);
        if (!hasAccessToChild) return res.sendStatus(401);

        const hasAccessToParent = await checkIfUserHasAccessToPerson(userId, parentId);
        if (!hasAccessToParent) return res.sendStatus(401);

        const editedPerson = await deleteChildRelationship(parentId, childId);
        res.json({editedPerson});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        res.status(400).json({error: errorMessage});
    }
});

router.post('/:userId/relationship/partner', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const data = req.body;

    try {
        const partner1Id = data.partner1Id;
        const partner2Id = data.partner2Id;

        const hasAccessToPartner1 = await checkIfUserHasAccessToPerson(userId, partner1Id);
        if (!hasAccessToPartner1) return res.sendStatus(401);

        const hasAccessToPartner2 = await checkIfUserHasAccessToPerson(userId, partner2Id);
        if (!hasAccessToPartner2) return res.sendStatus(401);

        const editedPersons = await addPartnerRelationship(partner1Id, partner2Id);
        res.json({editedPersons});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        res.status(400).json({error: errorMessage});
    }
});

router.delete('/:userId/relationship/partner', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const data = req.body;

    try {
        const partner1Id = data.partner1Id;
        const partner2Id = data.partner2Id;

        const hasAccessToPartner1 = await checkIfUserHasAccessToPerson(userId, partner1Id);
        if (!hasAccessToPartner1) return res.sendStatus(401);

        const hasAccessToPartner2 = await checkIfUserHasAccessToPerson(userId, partner2Id);
        if (!hasAccessToPartner2) return res.sendStatus(401);

        const editedPersons = await deletePartnerRelationship(partner1Id, partner2Id);
        res.json({editedPersons});
    } catch (e) {
        const errorMessage = parseErrorMessage(e);
        res.status(400).json({error: errorMessage});
    }
});

router.copy('/:userId/person/:personId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const personId = req.params.personId;
    const numberOfGenerations = req.query.n || 0;

    const copiedPersons = await copyPersonToUsersTree(userId, personId, +numberOfGenerations);
    res.json({copiedPersons});
});

export default router;