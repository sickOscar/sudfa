import React, {Component} from 'react';
import './App.scss';
import logo from './images/cover/full_logo.png';
import './icons';

import { Heading, Button} from 'arwes';

import {CustomLink} from './CustomLink';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      firstAccessComplete: null
    }
  }

  componentDidMount() {
    this.setState({
      firstAccessComplete: localStorage.getItem('firstAccessComplete')
    })
  }

  logout() {
    this.props.auth.logout();
  }

  login() {
    this.props.auth.login();
  }

  render() {

    const {isAuthenticated} = this.props.auth;

    return (

      <header>

        <CustomLink to="/">
          <img src={logo} className="header-logo" alt="SUDFAπ"/>
          <Heading node='h3' className="d-none d-sm-inline-block ml-2">
              Super Ultra Dev Fighter Arena
            {/*<span className="badge badge-secondary">BETA</span>*/}
          </Heading>
        </CustomLink>


          <ul>

            <li>
            <CustomLink to="/docs">
              Docs
            </CustomLink>
            </li>
            {
              isAuthenticated() && (
                <li>
                <CustomLink to="/profile">
                  My Profile
                </CustomLink>
                </li>
              )
            }
            {
              isAuthenticated() && (
                <li>
                <CustomLink to="/bots">
                  My Bots
                </CustomLink>
                </li>
              )
            }
            <li>
            <CustomLink to="/league">
              Leaderboard
            </CustomLink>
            </li>

            <li>
              {
                !isAuthenticated() && (
                  <Button animate onClick={this.login.bind(this)}>
                    Log In
                  </Button>
                )
              }
              {
                isAuthenticated() && (
                  <Button animate onClick={this.logout.bind(this)}>
                    Log Out
                  </Button>
                )
              }
            </li>
          </ul>
      </header>

    )
  }
}

export default App;
