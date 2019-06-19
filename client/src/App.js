import React, {Component} from 'react';
import './App.scss';
import logo from './images/cover/full_logo.png';
import './icons';

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {Link} from "react-router-dom";

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

      <Navbar bg="primary" expand="sm" variant="dark">

        <Navbar.Brand href="/" className="header-link">
          <img src={logo} className="header-logo" alt="SUDFAπ"/>
          <span className="d-none d-sm-inline-block">
              Super Ultra Dev Fighter Arena <span className="badge badge-secondary">BETA</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">

              <Link className="nav-link" to="/docs">
                Docs
              </Link>
            {
              isAuthenticated() && (
                <Link className="nav-link" to="/profile">
                  My Profile
                </Link>
              )
            }
            {
              isAuthenticated() && (
                <Link className="nav-link" to="/bots">
                  My Bots
                </Link>
              )
            }
            <Link className="nav-link" to="/league">
              Leaderboard
            </Link>

            <li className="nav-item">
              {
                !isAuthenticated() && (
                  <button className="btn btn-link nav-link" onClick={this.login.bind(this)}>
                    Log In
                  </button>
                )
              }
              {
                isAuthenticated() && (
                  <button className="btn btn-link nav-link" onClick={this.logout.bind(this)}>
                    Log Out
                  </button>
                )
              }
            </li>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

    )
  }
}

export default App;
