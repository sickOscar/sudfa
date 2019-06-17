import {Link} from 'react-router-dom';
import React from 'react';
import './Footer.scss';

const Footer = (props) => (
  <div className="row footer mt-5">
    <div className="col-sm-12 text-center">
      <h2>Super Ultra Dev Fighter Arena</h2>
    </div>

    <div className="col-md-12">
      <nav className="footer-nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/docs">Docs</Link>
          </li>
          <li>
            <Link to="/league">Leaderboard</Link>
          </li>
          <li>
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



