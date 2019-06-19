import {Link} from 'react-router-dom';
import React from 'react';
import './Footer.scss';
import logo from '../images/cover/full_logo.png';

const Footer = (props) => (
  <div className="row footer mt-5">
    <div className="col-sm-12 text-center">
      <img className="img-fluid" src={logo} alt="Super Ultra Dev Fight Arena"/>
    </div>

    <div className="col-md-12">
      <nav className="footer-nav">
        <ul className="list-unstyled list-inline">
          <li className="list-inline-item">
            <Link to="/">Home</Link>
          </li>
          <li className="list-inline-item">
            <Link to="/docs">Docs</Link>
          </li>
          <li className="list-inline-item">
            <Link to="/league">Leaderboard</Link>
          </li>
          <li className="list-inline-item">
            <Link to="/who">Who we are</Link>
          </li>
        </ul>
      </nav>
    </div>

    <div className="col-md-12 copyrights text-center">
      <a href="https://github.com/sickDevelopers/jsfight" target="_blank" rel="noopener noreferrer">
        <img src="https://img.shields.io/github/stars/sickDevelopers/jsfight.svg?style=social" alt="MIT"/>
      </a>
    </div>


  </div>

);

export default Footer;



