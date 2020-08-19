import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import history from './history';

import {
    ApolloClient,
    InMemoryCache,
  } from '@apollo/client';

import config from './server_config.json';


function createApolloClient(getIdTokenClaims)  {
  if(getIdTokenClaims == null) {
    return new ApolloClient({
        uri: config.graphqlEndpoint,
        cache: new InMemoryCache()
      });
    }
    const httpLink = createHttpLink({
      uri: config.graphqlEndpoint,
    });
    
    const authLink = setContext( async (request, { headers }) => {
      const idTokenClaims = await getIdTokenClaims();
      // return the header to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          "X-Auth-Token": idTokenClaims.__raw,
        },
      };
    });

    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    });
}


export default createApolloClient;
export function onRedirectCallback(appState) {
    history.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
};