import 'antd/dist/antd.css';
import './App.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from '@auth0/auth0-react';
import config from "./auth_config.json";
import onRedirectCallback from "./apollo_config";

ReactDOM.render(
  <Auth0Provider
  domain={config.domain}
  clientId={config.clientId}
  audience={config.audience}
  redirectUri={window.location.origin}
  onRedirectCallback={onRedirectCallback}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
