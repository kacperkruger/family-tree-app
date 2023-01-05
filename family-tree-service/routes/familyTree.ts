import express, {Request, Response, Router} from 'express';
import connectToNeo4j from '../utils/connectToNeo4j';
import findFamilyTreeByUser from '../queries/findFamilyTreeByUser';
import {Person} from '../models/Person';
import parseErrorMessage from '../utils/parseErrorMessage';
import createPersonAndAddToUserFamilyTree from '../queries/createPersonAndAddToUserFamilyTree';
import parsePerson from '../utils/parsePerson';
import addParentRelationship from '../queries/addParentRelationship';
import addPartnerRelationship from '../queries/addPartnerRelationship';
import deleteParentRelationShip from '../queries/deleteParentRelationShip';

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
    const result = session.run(deleteParentRelationShip, {
        userId,
        childId: data.childId,
        parentId: data.parentId
    });

    result.subscribe({
        onCompleted: async (statistic) => {
            if (statistic.updateStatistics.updates().relationshipsDeleted !== 1) res.status(404).json({error: 'One or more persons do not exist.'});
            else res.sendStatus(200);
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

export default router;