import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './App.scss';
import logo from './images/logo.png';
import './icons';

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

      <nav className="navbar navbar-expand-md navbar-dark bg-primary">

        <Link className="header-link" to="/">
          <img src={logo} className="header-logo" alt="SUDFAπ"/>
          Super Ultra Dev Fight Arena
        </Link>


        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>


        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/docs">
                <b>Docs</b>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">My profile</Link>
            </li>
            {
              isAuthenticated() && (
                <li className="nav-item">
                  <Link className="nav-link" to="/bots">My Bots</Link>
                </li>
              )
            }
            <li className="nav-item">
              <Link className="nav-link" to="/league">Leaderboard</Link>
            </li>
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
          </ul>
        </div>
      </nav>



    )
  }
}

export default App;
