// src/Auth/Auth.js

import history from './history';
import auth0 from 'auth0-js';

const HOST = window.location.protocol + '//' + window.location.hostname + ':5000';
const callbackUrl = process.env.NODE_ENV === 'production'
  ? (window.location.protocol + '//' + window.location.hostname)
  : (window.location.protocol + '//' + window.location.hostname + ':3000')


console.log("callbackUrl", callbackUrl);
// ...
export default class Auth {
  accessToken;
  idToken;
  expiresAt;



  constructor() {

    this.auth0 = new auth0.WebAuth({
      domain: 'codeinthedarkve.eu.auth0.com',
      clientID: 'XIa57QS7CiWhoD5Oo0xR8H78MGdJ45jL',
      redirectUri: callbackUrl + '/callback',
      responseType: 'token id_token',
      scope: 'openid'
    });

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {

    this.auth0.parseHash((err, authResult) => {

      if (authResult && authResult.accessToken && authResult.idToken) {

        this.setSession(authResult);

        fetch(`${HOST}/user`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${authResult.idToken}`
          }
        })
          .then(response => response.json())
          .then(user => {

            localStorage.setItem('user', JSON.stringify(user))

            if (user.name) {
              history.replace('/bots');
            } else {
              history.replace('/profile');
            }


          })
          .catch(err => console.error(err))

      } else if (err) {

        history.replace('/');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);

      }
      
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the Access Token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;

    localStorage.setItem('idToken', authResult.idToken);
    localStorage.setItem('expiresAt', expiresAt);

    
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
      }
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('idToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('user');

    this.auth0.logout({
      returnTo: window.location.origin
    });

    // navigate to the home route
    history.replace('/');
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  saveProfile(profile) {
    return fetch(`${HOST}/user`, {
      method: 'PUT',
      body: JSON.stringify({
        ...profile
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${this.getToken()}`
      }
    })
      .then(response => response.json())
      .then(user => {
        localStorage.setItem('user', JSON.stringify(user))
        history.replace('/bots');
      })
      .catch(err => console.error(err))
  }

  getToken() {
    return localStorage.getItem('idToken')
  }

  isAuthenticated() {
    if (localStorage.getItem('idToken') && localStorage.getItem('expiresAt')) {
      const expiresAt = localStorage.getItem('expiresAt');
      return new Date().getTime() < expiresAt;
    }
    return false;
  }
}
