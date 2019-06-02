import React from 'react';
import './Homepage.scss';
import {Link} from 'react-router-dom';

const Homepage = (props) => {

  const login = props.auth.login;

  return (
    <React.Fragment>
      <div className="row head-box">

        <div className="container">

          <div className="row">

            <div className="col-md-6 text-center">
              <h1>Are you ready to fight?</h1>

              <div className="subtitle">
                <p>
                  SUDFA is a competitive AI fighting game.<br/>
                  Challenge the world. Be the best.
                </p>

                <button onClick={login} className="btn btn-secondary">
                  Start now!
                </button>
              </div>

            </div>

            <div className="col-md-6">

            </div>
          </div>

        </div>

      </div>

      <div className="container">
        <div className="row claim-box">
          <div className="col-md-6">
            <h4>Build your team</h4>
            <p>
              Choose three champions from the available classes.
              What do you think will be most useful to you: the cunning
              of a Project Manager or the brute force of a Dev? Perhaps
              the subterfuges of a Marketer...
            </p>
          </div>
          <div className="col-md-6"></div>
        </div>

        <div className="row  claim-box">
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <h4>Program your AI</h4>
            <p>
              A simple set of APIs will allow you to choose how your
              soldiers will fight in the arena.
              Remember, it's no place for a brat!
            </p>
          </div>

        </div>

        <div className="row claim-box">
          <div className="col-md-6">
            <h4>Test your bots</h4>
            <p>
              Test your team against all the available bots: if you can't
              beat them, it will be very difficult to reach a good
              position in the ranking
            </p>
          </div>
          <div className="col-md-6"></div>
        </div>

        <div className="row claim-box">
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <h4>Be the best</h4>
            <p>
              Send your team into the arena to fight. It will fight against
              all the other players' teams twice. A net win is worth 3 points.
              A draw won is worth 1 point. Which team will be the best?
            </p>
          </div>

        </div>
      </div>


      <div className="row footer">
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


    </React.Fragment>
  )
}

export default Homepage;
