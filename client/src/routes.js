// src/routes.js

import React from 'react';
import {Route, Router, Redirect} from 'react-router-dom';
import Callback from './Callback';
import Auth from './Auth';
import EditBot from './EditBot/EditBot';
import Bots from './Bots/Bots';
import League from './League/League';
import Logout from './Logout';
import history from './history';
import App from './App';
import Fight from './Fight';
import Profile from './Profile'
import Homepage from './Homepage/Homepage';
import Docs from './Docs/Docs';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}


function PrivateRoute({component: Component, ...rest}) {
  return (
    <Route {...rest} render={(props) => {
      // console.log('isAuth', auth.isAuthenticated());
      if (auth.isAuthenticated())
        return <Component {...props} auth={auth}/>
      else
        return <Redirect to="/"/>
    }}/>
  );
}

export const makeMainRoutes = () => {
  return (

      <Router history={history}>

        <Route path="/" render={(props) => <App {...props} auth={auth}/>}/>

        <div className="container-fluid">

          <Route path="/" exact render={(props) => <Homepage {...props} auth={auth}/>}/>
          <Route path="/docs" exact component={Docs}/>

          <Route path="/logout" component={Logout}/>

          <PrivateRoute path="/bots" component={Bots}/>
          <PrivateRoute path="/edit/:botid" component={EditBot}/>
          <PrivateRoute path="/profile" component={Profile} />

          <Route path="/league" component={League}/>
          <Route path="/fight/:bot1/:bot2" component={Fight}/>

          <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} />
          }}/>
        </div>

      </Router>

  );
}
