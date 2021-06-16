import UserModel from '../model/User';
import jwt from 'jsonwebtoken';
import { Request, Response, Router } from 'express';
import _ from 'lodash';

/**
 * This is a simple JWT Server which manages issuing access and refresh JWT tokens, along with 
 * managing JWT refresh tokens server side so auth can be revoked.
 * 
 * Note that it is up to the client to refresh the token periodically.
 */

// TODO: clear out expired tokens from cache
// TODO: move cache to MongoDB

const router = Router();

const ACCESS_TOKEN_LIFETIME = '15m';
const REFRESH_TOKEN_LIFETIME = '1h';
const ACCESS_TOKEN_SECRET = 'abc123';
const REFRESH_TOKEN_SECRET = 'rabc123';

const refreshTokenStorage: any = {};

router.post("/login", function(req, res, next) {
    console.log('email : ' + req.body.email);
    console.log('password : ' + req.body.password);
    console.log('req.body = ' + req.body);

    const u = req.body.email;
    const p = req.body.password;
    if (!u || !p) {
        res.status(401).send({success: false, msg: 'Authentication failed. Invalid Email or Password.'});
        return;
    }

    UserModel.findOne({
        'local.email': u
      }, function(err: any, user: any) {
        if (err) throw err;
        console.log('user = ' + user);
        if (!user) {
          res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
          return;
        } else {
          // check if password matches
          if (user.validPassword(p)) {
              // if user is found and password is right create a token
              var accessToken = jwt.sign(user.toJson(), ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_LIFETIME});
              var refreshToken = jwt.sign(user.toJson(), REFRESH_TOKEN_SECRET, {expiresIn: REFRESH_TOKEN_LIFETIME});

              refreshTokenStorage[refreshToken] = user.toJson();

              // return the information including token as JSON
              res.json({success: true, accessToken: accessToken, refreshToken: refreshToken});
            } else {
              res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
              return;
            }
          }
        }
      );
});

router.post("/refresh", function(req, res, next) {
  const currRefreshToken = req.body.refreshToken;
  if (_.isUndefined(refreshTokenStorage[currRefreshToken])) {
    res.status(401).send({success: false, msg: 'Authentication failed. Token not found.'});
    return;
  }
  const decoded : any = jwt.verify(currRefreshToken, REFRESH_TOKEN_SECRET);
  UserModel.findOne({
      'local.email': decoded.email
    }, function(err:any, user: any) {
      if (err) throw err;
      console.log('user = ' + user);  
      if (_.isUndefined(user) || user == null) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        return;
      } else {
        // if user is found create new tokens
        var jsonUser = user.toJson();
        var accessToken = jwt.sign(jsonUser, ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_LIFETIME});
        var refreshToken = jwt.sign(jsonUser, REFRESH_TOKEN_SECRET, {expiresIn: REFRESH_TOKEN_LIFETIME});

        refreshTokenStorage[refreshToken] = jsonUser;

        // remove from token storage
        if (req.body?.keepOrig === 'true') {
          // keeping the original refresh token, forking the auth
        } else {
          delete refreshTokenStorage[currRefreshToken];
        }
        // return the information including token as JSON
        res.json({success: true, accessToken: accessToken, refreshToken: refreshToken, holder: jsonUser});
      }
    });
});

router.post("/revoke", function(req, res, next) {
  const currRefreshToken = req.body.refreshToken;
  if (_.isUndefined(refreshTokenStorage[currRefreshToken])) {
    res.status(401).send({success: false, msg: 'Authentication failed. Token not found.'});
    return;
  }
  // No real need to decode, just revoke
  // const decoded = jwt.verify(currRefreshToken, 'rabc123');

  // remove from token storage
  delete refreshTokenStorage[currRefreshToken];
  res.json({success: true});
});

export default router;
