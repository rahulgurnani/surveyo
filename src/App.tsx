import React, {Component} from 'react';
import {Row, Col} from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import './index.css';
import BigCard from './components/BigCard';
import GqlForm from './components/Form';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from '@apollo/client';

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
          <Route path="/form/:id" children={<GqlForm />} />
          <Route path="/graphiql" children={<GqlForm />} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
