import express, {Request, Response, Router} from 'express';
import connectToNeo4j from '../utils/connectToNeo4j';
import findFamilyTreeByUser from '../queries/findFamilyTreeByUser';
import {Person} from '../models/Person';
import parseErrorMessage from '../utils/parseErrorMessage';
import createPersonAndAddToUserFamilyTree from '../queries/createPersonAndAddToUserFamilyTree';
import parsePerson from '../utils/parsePerson';

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

    let person: Person;
    result.subscribe({
        onNext: record => {
            person = parsePerson(record);
        },
        onCompleted: async () => {
            res.json({person});
            await session.close;
        },
        onError: error => {
            const message = parseErrorMessage(error);
            res.json({error: message});
        }
    });
});

export default router;