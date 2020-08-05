import React, { Component } from 'react';
import { Row, Col, Button, Spin } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import './index.css';
import BigCard from './components/BigCard';
import FormPage from './components/Form';
import VizPage from './components/Viz';

import GqlForm from './components/Form';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import createAuth0Client from "@auth0/auth0-spa-js";
import { useAuth0 } from "@auth0/auth0-react";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  ApolloLink,
} from '@apollo/client';
import createApolloClient from './apollo_config';



function App() {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    getAccessTokenSilently,
    logout
  } = useAuth0();
  // const { isLoading, error } = useAuth0();

  // if (error) {
  //   return <div>Oops... {error.message}</div>;
  // }

  // if (isLoading) {
  //   // TODO(rahul): add a loading component
  // }
  console.log(isAuthenticated);
  const client = createApolloClient(user);
  return (isLoading) ?
    (<div>
      <Spin></Spin>
    </div>) :
    (isAuthenticated) ?
      (<ApolloProvider client={client}>
          <Router>
            <Switch>
              <Route exact path="/">
                <div>
                  <h1>
                    You are logged in
                  </h1>
                </div>        
              </Route>
              <Route path="/creator">
                <Row>
                  <Col span={6}></Col>
                  <Col span={12}>
                    <BigCard></BigCard>
                  </Col>
                  <Col span={6}></Col>
                </Row>
              </Route>
              <Route path="/form/:id" children={<FormPage />} />
              <Route path="/viz/:id" children={<VizPage />} />
            </Switch>
          </Router>
        </ApolloProvider>
      )
      :
      <Button
          onClick={() => getAccessTokenSilently().then((token: String) => { console.log("authenticated ", token) }).catch((error: Error) =>  { console.log(error); loginWithRedirect();})}
        >
          Log in
    </Button>
      
}

export default App;
