// src/routes.js

import React from 'react';
import {Route, Router, Redirect} from 'react-router-dom';
import Callback from './Auth/Callback';
import Auth from './Auth/Auth';
import EditBot from './EditBot/EditBot';
import Bots from './Bots/Bots';
import League from './League/League';
import Logout from './Logout';
import history from './history';
import App from './App';
import Fight from './Fight/Fight';
import Profile from './Profile/Profile'
import Homepage from './Homepage/Homepage';
import Docs from './Docs/Docs';
import Queue from './Queue/Queue';
import GoogleAnalytics from './GoogleAnalytics';
import WhoWeAre from './Who/Who';

import background from './images/background.jpg';
import glow from './images/glow.png';

import { ThemeProvider, createTheme, Arwes } from 'arwes';

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
    <ThemeProvider theme={createTheme()}>
      <Arwes animate show background={background} pattern={glow}>

        <Router history={history}>

          <Route path="/" render={(props) => <App {...props} auth={auth}/>}/>

          <div className="container-fluid">

            <Route path="/" exact render={(props) => <Homepage {...props} auth={auth}/>}/>
            <Route path="/docs" exact component={Docs}/>

            <Route path="/logout" component={Logout}/>

            <PrivateRoute path="/bots" component={Bots}/>
            <PrivateRoute path="/edit/:botid" component={EditBot}/>
            <PrivateRoute path="/edit-group/:botid/:groupid" component={EditBot}/>
            <PrivateRoute path="/profile" component={Profile} />

            {/*<Route path="/league/:botid?" render={(props) => <League {...props} auth={auth} />} />*/}
            <Route path="/league/:botid?/:groupid?" render={(props) => <League {...props} auth={auth} />} />
            <Route path="/queue/:botid" render={(props) => <Queue {...props} auth={auth} />} />
            <Route path="/queue/:botid/:groupid" render={(props) => <Queue {...props} auth={auth} />} />

            <Route path="/fight/:bot1/:bot2" component={Fight}/>

            <Route path="/who" component={WhoWeAre}/>

            <Route path="/callback" render={(props) => {
              handleAuthentication(props);
              return <Callback {...props} />
            }}/>
          </div>
          <GoogleAnalytics />
        </Router>

      </Arwes>
    </ThemeProvider>
  );
}
