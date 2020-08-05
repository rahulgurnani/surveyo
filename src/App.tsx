import React, { Component } from 'react';
import { Row, Col, Button, Spin } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import './index.css';
import BigCard from './components/BigCard';
import GraphiqlCard from './components/GraphiqlCard';
import FormPage from './components/Form';
import VizPage from './components/Viz';

import GqlForm from './components/Form';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import createAuth0Client from "@auth0/auth0-spa-js";
import { useAuth0 } from "@auth0/auth0-react";

import {ApolloProvider} from '@apollo/client';
import createApolloClient from './apollo_config';



function App() {
  const {
    user,
    isAuthenticated,
    isLoading,
    getIdTokenClaims,
    loginWithRedirect,
    getAccessTokenSilently,
    logout
  } = useAuth0();

  console.log("isAuthenticated", isAuthenticated);
  console.log("User", user);
  
  const client = createApolloClient(getIdTokenClaims);
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
          onClick={() => loginWithRedirect()}
        >
          Log in
    </Button>
}

export default App;
