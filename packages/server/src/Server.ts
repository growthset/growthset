import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import StatusCodes from 'http-status-codes';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLError } from 'graphql';

import { ApolloServerPlugin,  } from 'apollo-server-plugin-base';

import depthLimit from 'graphql-depth-limit';
import passport from 'passport';

import 'express-async-errors';

import BaseRouter from './routes';
import logger from '@shared/Logger';
import { cookieProps } from '@shared/constants';

import schema from './graphql/schema';
import mongoose from 'mongoose';

import security from './security';
import flash from 'connect-flash';

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/passport', { useNewUrlParser: true }); 

const app = express();
const { BAD_REQUEST } = StatusCodes;

security(passport);

const customError401Plugin: ApolloServerPlugin = {
	requestDidStart: () => ({
		willSendResponse({ errors, response }) {
            // console.log('custom error will send response...:' + response!.http + ":" + response!.http!.status);
            // console.log('errors? ' + errors + ' length = ' + errors!.length + ' name = ' + errors![0].name);
			if (response && response.http) {
				if (
					errors &&
					errors.some(
						(err: GraphQLError) => err.name === 'AuthenticationError' || err.message === 'must authenticate'
					)
				) {
					response.data = undefined;
					response.http.status = 401;
				}
			}
		},
	}),
};

const server = new ApolloServer({
    schema,

    // NOTE: if set to false, apollo won't send stack traces.
    debug: true,
    validationRules: [depthLimit(7)],
    introspection: true,
    playground: true,
    context: ({ req, res }) => ({
      getUser: () => {
          const done = (err: any, user: any, info: any) => {
              console.log("done: " + err + " " + user + " " + JSON.stringify(info));
          }
        // passport.authenticate('jwt', {session: false}, done)(req, res);
        if (req.isAuthenticated()) {
            console.log("IS AUTHENTICATED = TRUE");
          } else {
            console.log("IS AUTHENTICATED = FALSE");
          }
        return req.user;
        },
      // logout: () => req.logout(),
      passport: passport,
    }),
    plugins: [customError401Plugin]
  });

  interface User {
      id: string;
  };

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
// TODO: Remove after wiring in graphql from client
app.use('/api', BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

app.use(passport.initialize());

// NOTE: Have to comment out and re-enable to get GUI to show, need a better way
// For ease of deving, include token in GET params, but disable when in "production"

  app.use('/graphql',  passport.authenticate('jwt', { session: false}), 
      function(req, res, next) {
          return next();
      });

server.applyMiddleware({ app, path: '/graphql' });

/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default app;
