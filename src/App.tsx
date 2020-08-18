import React from 'react';
import { Button, Spin, Card } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import BigCard from './components/BigCard';
import GraphiqlCard from './components/GraphiqlCard';
import FormPage from './components/Form';
import VizPage from './components/Charts';
import Dashboard from './components/Dashboard';
import { ApolloProvider } from '@apollo/client';
import { Switch, Route, Link, NavLink, } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import createApolloClient from './apollo_config';
import logo from './logo.svg';
import { Layout, Typography } from 'antd';
import { useMutation, gql } from '@apollo/client';

function Loading() {
  return <div style={{ textAlign: "center" }}><Spin /></div>
}

function PrivateRoute({ component, ...args }: any) {
  return <Route
    component={withAuthenticationRequired(component, {
      onRedirecting: () => <Loading />,
    })}
    {...args}
  />
};

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
  const { loginWithRedirect, logout } = useAuth0();

  return (
    <>
      <div style={{ float: 'left' }}>
        <NavLink to="/">
          <img src={logo} style={{ height: '24px' }} />
        </NavLink>
      </div>
      <div style={{ float: 'right' }}>
        {isAuthenticated ? (
          <Button
            onClick={() =>
              logout({
                returnTo: window.location.origin,
              })
            }
            ghost
            style={{ color: '#000000', borderColor: '#000000', margin: '10px' }}
          >
            Logout
          </Button>
        ) : <Button
          onClick={() =>
            loginWithRedirect({
              returnTo: window.location.origin,
            })
          }
          ghost
          style={{ color: '#000000', borderColor: '#000000', margin: '10px' }}
        >
            Login
      </Button>
        }
      </div>
    </>
  );
}

function App() {
  const {
    isAuthenticated,
    isLoading,
    getIdTokenClaims,
  } = useAuth0();

  return <ApolloProvider client={createApolloClient(isAuthenticated ? getIdTokenClaims : null)}>
    <Layout>
      <Layout.Header style={{ background: 'white' }}>
        {SyMenu(isAuthenticated as Boolean)}
      </Layout.Header>
      <Layout.Content>
        <Card>
          {
            isLoading ?
              <Loading /> :
              <Switch>
                <Route exact path="/" component={isAuthenticated ? Dashboard : Home} />
                <Route exact path="/form/:id" component={FormPage} />
                <PrivateRoute exact path="/create" component={BigCard} />
                <PrivateRoute exact path="/charts/:id" component={VizPage} />
                <PrivateRoute exact path="/graphiql/:id" component={GraphiqlCard} />
              </Switch>
          }
        </Card>
      </Layout.Content>
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
    </Layout>
  </ApolloProvider>
}

function Home() {
  const [createUser, { loading: loadingResponse }] = useMutation(CREATE_USER);
  const { user } = useAuth0();
  createUser({ variables: { user: user } })
    .then(response => console.log('Success', response))
    .catch(error => console.error(error));
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
      }}
    >
      <img src={logo} />
      <Typography.Title level={3}>Surveys, simplified.</Typography.Title>
      <Link to="/create">
        <Button type="primary" size="large">
          Create a survey
        </Button>
      </Link>
    </Layout.Content>
  );
}

export default App;
