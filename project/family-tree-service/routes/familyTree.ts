import express, {Request, Response, Router} from 'express';
import connectToNeo4j from '../utils/connectToNeo4j';
import findFamilyTreeByUser from '../queries/findFamilyTreeByUser';
import {Person} from '../models/Person';
import parseErrorMessage from '../utils/parseErrorMessage';
import createPersonAndAddToUserFamilyTree from '../queries/createPersonAndAddToUserFamilyTree';
import parsePerson from '../utils/parsePerson';
import addParentRelationship from '../queries/addParentRelationship';
import addPartnerRelationship from '../queries/addPartnerRelationship';
import deleteParentRelationship from '../queries/deleteParentRelationship';
import deletePartnerRelationship from '../queries/deletePartnerRelationship';
import deletePerson from '../queries/deletePerson';
import editPerson from '../queries/editPerson';

const router: Router = express.Router();

router.get('/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const session = await connectToNeo4j();
    const result = session.run(findFamilyTreeByUser, {userId});

    const familyTree: Person[] = [];
    result.subscribe({
        onNext: record => {
            const person = parsePerson(record);
            familyTree.push(person);
        },
        onCompleted: async () => {
            res.json({familyTree});
            await session.close;
        },
        onError: error => {
            const message = parseErrorMessage(error);
            res.json({error: message});
        }
    });
});

router.post('/:userId/person', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const data = req.body;
    const session = await connectToNeo4j();
    const result = session.run(createPersonAndAddToUserFamilyTree, {
        userId,
        name: data.name,
        surname: data.surname || '',
        gender: data.gender || '',
        dateOfBirth: data.dateOfBirth || null
    });

    let createdPerson: Person;
    result.subscribe({
        onNext: record => {
            createdPerson = parsePerson(record);
        },
        onCompleted: async () => {
            res.json({createdPerson});
            await session.close;
        },
        onError: error => {
            const message = parseErrorMessage(error);
            res.json({error: message});
        }
    });
});

router.put('/:userId/person/:personId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const personId = req.params.personId;
    const data = req.body;
    const session = await connectToNeo4j();

    const result = session.run(editPerson, {
        userId,
        personId,
        name: data.name,
        surname: data.surname,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth
    });

    let editedPerson: Person;
    result.subscribe({
        onNext: record => {
            editedPerson = parsePerson(record);
        },
        onCompleted: async () => {
            res.json({editedPerson});
            await session.close;
        },
        onError: error => {
            const message = parseErrorMessage(error);
            res.json({error: message});
        }
    });
});

router.delete('/:userId/person/:personId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const personId = req.params.personId;
    const session = await connectToNeo4j();

    const result = session.run(deletePerson, {
        userId,
        personId
    });

    result.subscribe({
        onCompleted: async (statistics) => {
            if (statistics.updateStatistics.updates().nodesDeleted !== 1) res.status(404).json({error: 'Person with given id does not exists'});
            else res.sendStatus(200);
            await session.close;
        },
        onError: error => {
            const message = parseErrorMessage(error);
            res.json({error: message});
        }
    });
});

router.post('/:userId/relationship/parent', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const data = req.body;
    const session = await connectToNeo4j();
    const result = session.run(addParentRelationship, {
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
    const result = session.run(deleteParentRelationship, {
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
    const result = session.run(addPartnerRelationship, {
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
    const result = session.run(deletePartnerRelationship, {
        userId,
        partner1Id: data.partner1Id,
        partner2Id: data.partner2Id
    });
    console.log('adam');
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

export default router;