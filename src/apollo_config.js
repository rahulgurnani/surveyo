import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import history from './history';

import {
    ApolloClient,
    InMemoryCache,
  } from '@apollo/client';

  
function createApolloClient(token)  {
    const httpLink = createHttpLink({
      uri: "https://surveyo.us-west-2.aws.cloud.dgraph.io/graphql",
      // options: {
      //   reconnect: true,
      // },
    });
  
    const authLink = setContext((request, { headers }) => {
      // return the header to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          "X-Auth-Token": token,
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
    console.log("onRedirectCallback");
    history.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
};