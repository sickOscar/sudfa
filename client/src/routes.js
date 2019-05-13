// src/routes.js

import React from 'react';
import { Route, Router, Redirect } from 'react-router-dom';
import App from './App';
import Callback from './Callback';
import Auth from './Auth';
import EditBot from './EditBot';
import Bots from './Bots';
import League from './League';
import Login from './Login';
import Logout from './Logout';
import history from './history';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}



function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={ (props) =>  {
      console.log('PRIVATE', auth.isAuthenticated())
      if (auth.isAuthenticated()) {
        return <Component {...props} auth={auth} />
      } else {
        return <Redirect to="/login" />
      }
    }} />
  );
}

export const makeMainRoutes = () => {
  return (
    <Router history={history}>

          <Route path="/login" render={(props) => <Login {...props} auth={auth} />} />
          <Route path="/logout" component={Logout} />

          
          <PrivateRoute path="/bots" component={Bots} />
          <PrivateRoute path="/edit/:botId" component={EditBot} />


          <Route path="/league" component={League} />
          <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} /> 
          }}/>
    </Router>
  );
}