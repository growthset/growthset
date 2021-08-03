import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from 'react-query'

import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const getTokenFromStorage = () => {
  const storedValue = localStorage.getItem('token');

  if (!storedValue) {
    return undefined;
  }

  let token;

  try {
    token = JSON.parse(storedValue);
    // eslint-disable-next-line no-empty
  } catch {}

  return token;
};

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getTokenFromStorage()?.jwtAccess;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const graphqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});



const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={graphqlClient}>
      <QueryClientProvider client={queryClient}>
       <App />
      </QueryClientProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
