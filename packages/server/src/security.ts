
// import {Strategy as LocalStrategy} from 'passport-local';
import UserModel from './model/User';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';

export default function (passport: any ) {

    var opts: any = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'abc123';

    passport.serializeUser(function(user: any, done: any) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id: string, done: any) {
        UserModel.findById(id, function(err: any, user: any) {
            done(err, user);
        });
    });

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

        // TODO: Consider anonymous access?
        // may be done with custom handlers possibly

        console.log('jwt_payload: ' + jwt_payload.iat);
        UserModel.findOne({'local.email': jwt_payload.email}, function(err: any, user: any) {
            if (err) {
                return done(err, false, { message: '{\"message\":\"Auth Error\"}' });
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, { message: '{\"message\":\"User Error\"}' });
                // or you could create a new account
            }
        });
    }));
    
}
