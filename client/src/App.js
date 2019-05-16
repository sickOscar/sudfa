import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  logout() {
    this.props.auth.logout();
  }

  login() {
    this.props.auth.login();
  }

  componentDidMount() {
      console.log('check session')
      // const {renewSession} = this.props.auth;

      // if (localStorage.getItem('isLoggedIn') === 'true') {
      //   renewSession()
      // }
  }


  render() {

    const {isAuthenticated} = this.props.auth;

    return (
      <div>
          <div className="toolbar">
            {
              !isAuthenticated() && (
                <button
                  id="qsLoginBtn"
                  className="btn-margin"
                  onClick={this.login.bind(this)}
                >
                  Log In
                </button>
              )
            }
            {
              isAuthenticated() && (
                <button
                  id="qsLogoutBtn"
                  className="btn-margin"
                  onClick={this.logout.bind(this)}
                >
                  Log Out
                </button>
              )
            }
          </div>
      </div>
    )
  }
}

export default App;
