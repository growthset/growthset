// Borrowed From https://github.com/killerchip/token-query

import { QueryClient, QueryObserver } from 'react-query';
import { useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual';

const queryClient = new QueryClient();

export interface Config<TToken, TLoginParams> {
  tokenExpired: (token: TToken) => boolean;
  refreshExpired: (token: TToken) => boolean;
  sendLogin: (loginParams: TLoginParams) => Promise<TToken>;
  sendRefresh: (token: TToken, keepOrig?: boolean) => Promise<TToken>;
  retry: (failCount: number, error: any) => boolean;
  refreshExpiredError: any;
  queryKey?: string;
  shouldRefreshOnBackground?: (token: TToken) => boolean;
}

function createTokenQuery<TToken, TLoginParams>({
  queryKey = 'token',
  tokenExpired,
  refreshExpired,
  sendLogin,
  sendRefresh,
  retry,
  refreshExpiredError,
  shouldRefreshOnBackground
}: Config<TToken, TLoginParams>) {
  let tokenRefreshIntervalHandler: any;
  let tokenRefreshInterval: number;

  const getTokenFromStorage = () => {
    const storedValue = localStorage.getItem(queryKey);

    if (!storedValue) {
      return undefined;
    }

    let token: TToken | undefined;

    try {
      token = JSON.parse(storedValue);
      // eslint-disable-next-line no-empty
    } catch {}

    return token;
  };

  const setTokenValue = (token: TToken | undefined) => {
    if (token === undefined) {
      localStorage.removeItem(queryKey);
    } else {
      localStorage.setItem(queryKey, JSON.stringify(token));
    }
    queryClient.setQueryData(queryKey, token);
  };

  const refresh = async (throwOnError = false) => {
    const token = queryClient.getQueryData(queryKey) as TToken;
    
    const newToken: TToken = await queryClient.fetchQuery({
      queryKey: [`temp-refresh-${queryKey}`],
      queryFn: () => sendRefresh(token),
      retry,
      cacheTime: 0,
    });

    // If token is undefined then refresh has failed, should we do anything about it???
    if (newToken !== undefined) {
      setTokenValue(newToken);
    }
    return newToken;
  };

  const clone = async (throwOnError = false) => {
    const token = queryClient.getQueryData(queryKey) as TToken;
    
    const newToken: TToken = await queryClient.fetchQuery({
      queryKey: [`temp-refresh-${queryKey}`],
      queryFn: () => sendRefresh(token, true),
      retry,
      cacheTime: 0,
    });
    return newToken;
  };

  const startBackgroundRefreshing = () => {
    clearInterval(tokenRefreshIntervalHandler);

    tokenRefreshIntervalHandler = setInterval(() => {
      refresh();
    }, tokenRefreshInterval);
  };

  const stopBackgroundRefreshing = () => {
    clearInterval(tokenRefreshIntervalHandler);
  };

  const login = async (loginParams: TLoginParams) => {
      const token: TToken = await queryClient.fetchQuery({
        queryKey: [`temp-login-${queryKey}`],
        queryFn: () => sendLogin(loginParams),
        retry,
        cacheTime: 0,
      });
      if (tokenRefreshInterval) {
        startBackgroundRefreshing();
      }
      return token;
  };

  const logout = async () => {
    setTokenValue(undefined);
    stopBackgroundRefreshing();
  };

  const useLogin = () => {
    const [data, setData] = useState<TToken | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<any | null>(null);

    const requestLogin = async (
      loginParams: TLoginParams,
      throwOnError = false
    ) => {
      setIsFetching(true);
      setData(null);
      setError(null);

      try {
        const token : any = await login(loginParams);

        setIsFetching(false);
        setData(token);
        setTokenValue(token);

        return token;
      } catch (loginError) {
        setIsFetching(false);
        setError(loginError);

        if (throwOnError) {
          throw loginError;
        }
      }

      return undefined;
    };

    return { data, isFetching, error, requestLogin };
  };

  const useToken = () => {
    const existingToken = queryClient.getQueryData(queryKey) as TToken;
    const [token, setToken] = useState<TToken | undefined>(existingToken);

    useEffect(() => {
      const observer = new QueryObserver(queryClient, { queryKey });
      const unsubscribe = observer.subscribe(() => {
        const newToken = queryClient.getQueryData([queryKey]) as
          | TToken
          | undefined;

        if (!isEqual(token, newToken)) {
          setToken(newToken);
        }
      });

      return () => {
        unsubscribe();
      };
    });

    return token;
  };

  const getToken = async (force = false) => {
    const token = queryClient.getQueryData(queryKey) as TToken | undefined;

    if (token === undefined) return undefined;

    if (refreshExpired(token)) {
      throw refreshExpiredError;
    }

    if (tokenExpired(token) || force) {
      const newToken = await refresh(true);

      return newToken;
    }

    if (shouldRefreshOnBackground && shouldRefreshOnBackground(token)) {
      refresh();
    }

    return token;
  };

  const init = async (refreshInterval?: number) => {
    if (refreshInterval) {
      tokenRefreshInterval = refreshInterval;
    }

    const token = getTokenFromStorage();

    if (!token || refreshExpired(token)) {
      setTokenValue(undefined);

      return;
    }

    setTokenValue(token);

    if (refreshInterval) {
      startBackgroundRefreshing();
    }
  };

  return { init, useLogin, useToken, logout, refresh, clone, getToken };
}

export default createTokenQuery;
