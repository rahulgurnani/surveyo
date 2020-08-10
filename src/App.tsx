import React from 'react';
import {Row, Col, Button, Spin} from 'antd';
import './App.css';
import 'antd/dist/antd.css';

import BigCard from './components/BigCard';
import GraphiqlCard from './components/GraphiqlCard';
import FormPage from './components/Form';
import VizPage from './components/Viz';
import Viz2 from './components/Viz2';
import {ApolloProvider} from '@apollo/client';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
} from 'react-router-dom';
import {useAuth0} from '@auth0/auth0-react';
import createApolloClient from './apollo_config';

import logo from './logo.svg';

import {Layout, Typography} from 'antd';

import {LineChartOutlined, FormOutlined} from '@ant-design/icons';

import {useMutation, gql} from '@apollo/client';

const CREATE_USER = gql`
  mutation($user: AddUserInput!) {
    addUser(input: [$user]) {
      user {
        id
      }
    }
  }
`;

function SyMenu(isAuthenticated: Boolean) {
  const {
    logout,
  } = useAuth0();
  
  return (
    <>
      <div style={{float: 'left'}}>
        <NavLink to="/">
          <img src={logo} style={{height: '24px'}} />
        </NavLink>
      </div>
      <div style={{float: 'right'}}>
        <NavLink
          to="/creator"
          activeStyle={{color: '#1890ff'}}
          style={{color: '#000000', padding: '10px'}}
        >
          <FormOutlined style={{paddingRight: '5px'}} />
          Creator
        </NavLink>
        <NavLink
          to="/viz"
          activeStyle={{color: '#1890ff'}}
          style={{color: '#000000', padding: '10px'}}
        >
          <LineChartOutlined style={{paddingRight: '5px'}} />
          Viz
        </NavLink>

        {isAuthenticated ? (
          <Button
            onClick={() => logout({
              returnTo: window.location.origin,
            })}
            ghost
            style={{color: '#000000', borderColor: '#000000', margin: '10px'
          }}
          >
            Logout
          </Button>
        ) : null}
      </div>
    </>
  );
}

function RoutedApp() {
  return (
    <Router>
        <Layout>
          <Layout.Header style={{background: 'white'}}>
            {SyMenu(true)}
          </Layout.Header>

          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/creator">
              <Layout.Content>
                <Row>
                  <Col span={6}></Col>
                  <Col span={12}>
                    <BigCard />
                  </Col>
                  <Col span={6}></Col>
                </Row>
              </Layout.Content>
            </Route>
            <Route exact path="/form/:id" children={<FormPage />} />
            <Route exact path="/viz" children={<Viz2 />} />
            <Route exact path="/viz/:id/charts" children={<VizPage />} />
            <Route exact path="/viz/:id/graphiql" children={<GraphiqlCard />} />
          </Switch>
        </Layout>

        <Layout.Footer
          style={{
            background: 'white',
            bottom: '0',
            width: '100%',
            textAlign: 'center',
          }}
        >
          Copyright &copy; Surveyo. All rights reserved.
        </Layout.Footer>
      </Router>
  );
}

function App() {
  const {
    user,
    isAuthenticated,
    isLoading,
    getIdTokenClaims,
    loginWithRedirect,
  } = useAuth0();

  console.log('isAuthenticated', isAuthenticated);
  console.log('User', user);

  // TODO(rahul): Check if user.email_verified
  return isLoading ? (
    <div>
      <Spin></Spin>
    </div>
  ) : isAuthenticated ? (
    <ApolloProvider client={createApolloClient(getIdTokenClaims)}>
      <RoutedApp/>
    </ApolloProvider>
  ) : (
    <ApolloProvider client={createApolloClient(null)}>
      <Router>
        <Layout>
          <Layout.Header style={{background: 'white'}}>
            {SyMenu(isAuthenticated as Boolean)}
          </Layout.Header>
          <Switch>
            <Route exact path="/">
            <Layout.Content
            style={{
              background: 'white',
              height: '80vh',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Button type="primary" size="large" onClick={() => loginWithRedirect()}>Log in</Button>
              <br></br>
              <Button type="primary" size="large" onClick={() =>  
                loginWithRedirect({ 
                  screen_hint: "signup", 
                  })}>
                  Sign up
              </Button>
            </Layout.Content>
            </Route>
            <Route path="/form/:id" children={<FormPage />} />
          </Switch>
        </Layout>

        <Layout.Footer
          style={{
            background: 'white',
            bottom: '0',
            width: '100%',
            textAlign: 'center',
          }}
        >
          Copyright &copy; Surveyo. All rights reserved.
        </Layout.Footer>
      </Router>
    </ApolloProvider>
  );
}

function Home() {
  
  return (
    <Layout.Content
      style={{
        background: 'white',
        height: '80vh',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <img src={logo} />
      <Typography.Title level={3}>Surveys, simplified.</Typography.Title>
      <Link to="/creator">
        <Button type="primary" size="large">
          Create a survey
        </Button>
      </Link>
    </Layout.Content>
  );
}

export default App;
