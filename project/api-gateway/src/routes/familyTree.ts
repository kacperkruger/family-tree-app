import express, {Request, Response} from 'express';
import {
    addParentRelationship,
    addPartnership,
    addPerson,
    copyPerson,
    deleteParentRelationship,
    deletePartnership,
    deletePerson,
    editPerson,
    getFamilyTree,
    getUsersBySurnames
} from '@kacperkruger/clients/family-tree';
import {isClientError} from '@kacperkruger/clients';
import {parseErrorMessage} from '@kacperkruger/common-server-utils';
import {getUsersDetails} from '@kacperkruger/clients/user';

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<Response> => {
    const userId = <string>req.user?._id;
    try {
        const familyTree = await getFamilyTree(userId);
        return res.json({familyTree});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.post('/persons', async (req: Request, res: Response): Promise<Response> => {
    const userId = <string>req.user?._id;
    try {
        const addedPerson = await addPerson(userId, req.body);
        return res.json({person: addedPerson});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.put('/persons/:personId', async (req: Request, res: Response): Promise<Response> => {
    const userId = <string>req.user?._id;
    const personId = req.params.personId;
    try {
        const editedPerson = await editPerson(userId, personId, req.body);
        return res.json({person: editedPerson});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.delete('/persons/:personId', async (req: Request, res: Response): Promise<Response> => {
    const userId = <string>req.user?._id;
    const personId = req.params.personId;
    try {
        await deletePerson(userId, personId);
        return res.sendStatus(204);
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.post('/relationships/parents/:parentId/children/:childId/', async (req: Request, res: Response) => {
    const userId = <string>req.user?._id;
    const parentId = req.params.parentId;
    const childId = req.params.childId;
    try {
        const editedPerson = await addParentRelationship(userId, childId, parentId);
        return res.json({person: editedPerson});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.delete('/relationships/parents/:parentId/children/:childId', async (req: Request, res: Response): Promise<Response> => {
    const userId = <string>req.user?._id;
    const parentId = req.params.parentId;
    const childId = req.params.childId;
    try {
        const editedPerson = await deleteParentRelationship(userId, childId, parentId);
        return res.json({person: editedPerson});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.post('/relationships/partners/:partner1Id/partners/:partner2Id', async (req: Request, res: Response): Promise<Response> => {
    const userId = <string>req.user?._id;
    const partner1Id = req.params.partner1Id;
    const partner2Id = req.params.partner2Id;
    try {
        const editedPersons = await addPartnership(userId, partner1Id, partner2Id);
        return res.json({persons: editedPersons});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.delete('/relationships/partners/:partner1Id/partners/:partner2Id', async (req: Request, res: Response): Promise<Response> => {
    const userId = <string>req.user?._id;
    const partner1Id = req.params.partner1Id;
    const partner2Id = req.params.partner2Id;
    try {
        const editedPersons = await deletePartnership(userId, partner1Id, partner2Id);
        return res.json({persons: editedPersons});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.post('/persons/:personId', async (req: Request, res: Response): Promise<Response> => {
    const userId = <string>req.user?._id;
    const personId = req.params.personId;
    const nGenerations = req.query.n || 0;
    try {
        const copiedPersons = await copyPerson(userId, personId, +nGenerations);
        return res.json({persons: copiedPersons});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.get('/users', async (req: Request<{}, {}, {}, { surname: string | string[] }>, res: Response): Promise<Response> => {
    let surnames = req.query.surname;
    if (typeof surnames === 'string') surnames = [surnames];
    try {
        const usersToFetch = await getUsersBySurnames(surnames);
        if (usersToFetch.length === 0) return res.status(404).json({error: 'Persons not found'});
        const users = await getUsersDetails(usersToFetch);
        return res.json({users});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

router.get('/users/:userId', async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId;
    try {
        const familyTree = await getFamilyTree(userId);
        return res.json({familyTree});
    } catch (e) {
        if (isClientError(e)) return res.status(e.response?.status || 500).json({error: e.response?.data.error});
        return res.status(500).json({error: parseErrorMessage(e)});
    }
});

export default router;