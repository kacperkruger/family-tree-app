import express, {Request, Response, Router} from 'express';
import connectToNeo4j from '../utils/connectToNeo4j';
import {Person} from '../models/Person';
import parseErrorMessage from '../utils/parseErrorMessage';
import parsePerson from '../utils/parsePerson';
import addPartner from '../queries/addPartner';
import deleteParent from '../queries/deleteParent';
import deletePartner from '../queries/deletePartner';
import copyPersonToUsersTree from '../operations/copyPersonToUsersTree';
import getFamilyTree from '../operations/getFamilyTree';
import addPerson from '../operations/addPerson';
import updatePerson from '../operations/updatePerson';
import removePerson from '../operations/removePerson';
import checkIfUserHasAccessToPerson from '../operations/checkIfUserHasAccessToPerson';

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
    const session = await connectToNeo4j();

    const result = session.run(addParentToPerson, {
        userId,
        childId: data.childId,
        parentId: data.parentId
    });

    const editedPersons: Person[] = [];
    result.subscribe({
        onNext: record => {
            const person = parsePerson(record);
            editedPersons.push(person);
        },
        onCompleted: async () => {
            if (!editedPersons.length) res.status(404).json({error: 'One or more persons do not exist.'});
            else res.json({editedPersons});
            await session.close;
        },
        onError: error => {
            const message = parseErrorMessage(error);
            res.json({error: message});
        }
    });
});

router.delete('/:userId/relationship/parent', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const data = req.body;
    const session = await connectToNeo4j();

    const result = session.run(deleteParent, {
        userId,
        childId: data.childId,
        parentId: data.parentId
    });

    const editedPersons: Person[] = [];
    result.subscribe({
        onNext: record => {
            const person = parsePerson(record);
            editedPersons.push(person);
        },
        onCompleted: async () => {
            if (!editedPersons.length) res.status(404).json({error: 'Persons or relationships do not exist.'});
            else res.json({editedPersons});
            await session.close;
        },
        onError: error => {
            const message = parseErrorMessage(error);
            res.json({error: message});
        }
    });
});

router.post('/:userId/relationship/partner', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const data = req.body;
    const session = await connectToNeo4j();

    const result = session.run(addPartner, {
        userId,
        partner1Id: data.partner1Id,
        partner2Id: data.partner2Id
    });

    const editedPersons: Person[] = [];
    result.subscribe({
        onNext: record => {
            const person = parsePerson(record);
            editedPersons.push(person);
        },
        onCompleted: async () => {
            if (!editedPersons.length) res.status(404).json({error: 'One or more persons do not exist.'});
            else res.json({editedPersons});
            await session.close;
        },
        onError: error => {
            const message = parseErrorMessage(error);
            res.json({error: message});
        }
    });
});

router.delete('/:userId/relationship/partner', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const data = req.body;
    const session = await connectToNeo4j();

    const result = session.run(deletePartner, {
        userId,
        partner1Id: data.partner1Id,
        partner2Id: data.partner2Id
    });

    const editedPersons: Person[] = [];
    result.subscribe({
        onNext: record => {
            const person = parsePerson(record);
            editedPersons.push(person);
        },
        onCompleted: async () => {
            if (!editedPersons.length) res.status(404).json({error: 'Persons or relationship do not exist.'});
            else res.json({editedPersons});
            await session.close;
        },
        onError: error => {
            const message = parseErrorMessage(error);
            res.json({error: message});
        }
    });
});

router.copy('/:userId/person/:personId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const personId = req.params.personId;
    const numberOfGenerations = req.query.n || 0;

    const copiedPersons = await copyPersonToUsersTree(userId, personId, +numberOfGenerations);
    res.json({copiedPersons});
});

export default router;