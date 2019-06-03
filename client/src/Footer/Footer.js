import {Link} from 'react-router-dom';
import React from 'react';

const Footer = (props) => (
  <div className="row footer mt-5">
    <div className="col-sm-12 text-center">
      <h5>Super Ultra Dev Fight Arena</h5>
    </div>

    <div className="col-sm-6">
      <nav>
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


  </div>

);

export default Footer;



