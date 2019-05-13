import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  componentDidMount() {
    const { renewSession } = this.props.auth;

    if (localStorage.getItem('isLoggedIn') === 'true') {
      renewSession();
    }
  }


  render() {

    const { isAuthenticated } = this.props.auth;

    if (isAuthenticated()) {
      return <div>
        <button onClick={this.login.bind(this)}>Logout</button>
      </div>;
    } else {
      return (
        <div>
          <button onClick={this.login.bind(this)}>Login</button>
        </div>
      )
    }
    
  }
}

export default App;
