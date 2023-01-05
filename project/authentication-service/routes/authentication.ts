import express, {Request, Response, Router} from 'express';
import passport from 'passport';

const router: Router = express.Router();

router.post('/login', passport.authenticate('local'));

router.post('/logout', (req: Request, res: Response) => {
    req.logout(err => {
        if (err) res.sendStatus(500);
        res.sendStatus(200);
    });
});

router.get('verify-authentication', (req: Request, res: Response) => {
    if (!req.isUnauthenticated()) return res.sendStatus(401);
    res.json({user: req.user});
});


export default router;