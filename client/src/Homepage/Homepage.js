import React from 'react';
import './Homepage.scss';

const Homepage = (props) => {
  return (
    <div className="row head-box">


      <div className="col-md-6 text-center">
        <h1>Are you ready to fight?</h1>

        <div className="subtitle">
          <p>
            SUDFA is a competitive AI fighting game.<br />
            Challenge the world. Be the best.
          </p>

          <button className="btn btn-secondary">
            Start now!
          </button>
        </div>


      </div>



    </div>
  )
}

export default Homepage;
