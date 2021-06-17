import { Request, Response, Router } from 'express';
import passport from 'passport';
import UserModel from '../model/User';

const router = Router();
router.get("/private", passport.authenticate('jwt', { session: false}), function(req, res, next) {
    console.log('isAuth? ' + req.isAuthenticated());
    res.send("Private API is working properly");
});
router.get("/", function(req, res, next) {
    console.log(req.headers);
    // TODO: Come up with a better way to init a default user.
    UserModel.countDocuments({}, function (err, count) {
        console.log('test: there are %d users', count);
        if (count == 0) {
            // no users, go ahead and create a sample user.
            UserModel.create({local: {email: 'test@growthset.io', password: 'password'}});
        }
    });
    res.send("API is working properly");
    
});

export default router;
