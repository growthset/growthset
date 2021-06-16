import { Request, Response, Router } from 'express';
import passport from 'passport';

const router = Router();
router.get("/private", passport.authenticate('jwt', { session: false}), function(req, res, next) {
    console.log('isAuth? ' + req.isAuthenticated());
    res.send("Private API is working properly");
});
router.get("/", function(req, res, next) {
    console.log(req.headers);
    res.send("API is working properly");
});

export default router;
