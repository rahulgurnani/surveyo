import React, {Component} from 'react';
import {Row, Col} from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import './index.css';
import BigCard from './components/BigCard';
import FormPage from './components/Form';
import VizPage from './components/Viz';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://surveyo.us-west-2.aws.cloud.dgraph.io/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
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
  );
}

export default App;
