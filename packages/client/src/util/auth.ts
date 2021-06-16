import createTokenQuery from './tokenQuery';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import _ from 'lodash';

export interface Token {
  jwtAccess: string;
  jwtRefresh: string;
  accessExp: number;
  refreshExp: number;
  holder: string;
}

interface LoginParams {
  email: string;
  password: string;
}

const tokenExpired = (token: Token) => {
  const now = new Date().getTime();

  return token.accessExp < now;
};

const refreshExpired = (token: Token) => {
  const now = new Date().getTime();

  return token.refreshExp < now;
};

// simulating sending a login request
// and the response
const sendLogin = async (data: LoginParams) => {
  return new Promise<Token>((resolve, reject) =>
    axios.post('http://localhost:4000/api/jwt/login', {email: data.email, password: data.password }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
    .then(response => {
      // if error, use reject() api
      console.log(response.status);

      if (response.status === 200) {
        const at: any = jwt.decode(response.data.accessToken);
        const rt: any = jwt.decode(response.data.refreshToken);

        console.log(at);
        console.log(rt);
        resolve({
          jwtAccess: response.data.accessToken,
          jwtRefresh: response.data.refreshToken,
          accessExp: at.exp,
          refreshExp: rt.exp,
          holder: response.data.holder
        });
      } else {
        reject(response.data);
      }
    }).catch(error => {
      console.log(error.response);
      reject(error);
    }))
};

// simulating sending a refresh-token request
// and the response with the new token
const sendRefresh = async (data: Token, keepOrig = false) => {
  return new Promise<Token>((resolve, reject) => {
    if (_.isUndefined(data?.jwtRefresh)) {
      reject('no refresh token available');
    }
    axios.post('http://localhost:4000/api/jwt/refresh', {refreshToken: data.jwtRefresh, keepOrig}, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
    .then(response => {
      // if error, use reject() api
      if (response.status === 200) {
        const at: any = jwt.decode(response.data.accessToken);
        const rt: any = jwt.decode(response.data.refreshToken);

        console.log(at);
        console.log(rt);
        resolve({
          jwtAccess: response.data.accessToken,
          jwtRefresh: response.data.refreshToken,
          accessExp: at.exp,
          refreshExp: rt.exp,
          holder: response.data.holder
        });
      } else {
        reject(response.data);
      }
      console.log(response.status);
    }).catch(error => {
      console.log(error.response)
      reject(error.response);
    }); 
  });
};

const retry = (count: number, error: any) => {
  return count < 3 && error?.response?.status !== 401;
}

const shouldRefreshOnBackground = (token: Token) => {
  const REFRESH_TIME_BEFORE_EXPIRE = 1000 * 60 * 1;

  const now = new Date().getTime();
  return now > token.accessExp - REFRESH_TIME_BEFORE_EXPIRE;
};

const tokenQuery = createTokenQuery<Token, LoginParams>({
  queryKey: 'token',
  tokenExpired,
  refreshExpired,
  sendLogin,
  sendRefresh,
  retry,
  refreshExpiredError: new Error('401-Refresh token expired'),
  shouldRefreshOnBackground
});

tokenQuery.init(1000 * 60); // 1min

/* eslint-disable prefer-destructuring */
export const useToken = tokenQuery.useToken;
export const useLogin = tokenQuery.useLogin;
export const logout = tokenQuery.logout;
export const refresh = tokenQuery.refresh;
export const clone = tokenQuery.clone;
export const getToken = tokenQuery.getToken;
/* eslint-enable prefer-destructuring */

export default tokenQuery;
