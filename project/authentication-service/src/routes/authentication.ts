import express, {Request, Response, Router} from 'express';
import passport from 'passport';

const router: Router = express.Router();

router.post('/login', passport.authenticate('local'), (_req: Request, res: Response): Response => {
    return res.sendStatus(200);
});

router.post('/logout', (req: Request, res: Response) => {
    req.logout(err => {
        if (err) return res.sendStatus(500);
        return res.sendStatus(200);
    });
});

router.get('/me', (req: Request, res: Response): Response => {
    if (req.isUnauthenticated()) return res.sendStatus(401);
    return res.json({user: req.user});
});


export default router;