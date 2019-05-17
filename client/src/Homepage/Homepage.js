import React from 'react';

import logo from '../images/logo.png';

const Homepage = (props) => {
  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="jumbotron">
          <div className="row">

            <div className="col-md-3 text-center">
              <img src={logo} style={{maxWidth: '100%'}} alt="LOGO"/>
            </div>

            <div className="col-md-9">
              <h1>Super Ultra Dev Fight Arena</h1>
              <p>The coolest thing ever</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage;
