import React from 'react';
import './Homepage.scss';
import Footer from '../Footer/Footer.js';
import Terminal from './Terminal';

import dev from '../images/personaggi/dev.png';
import pm from '../images/personaggi/po.png';
import mktg from '../images/personaggi/mktg.png';



const Homepage = (props) => {

  const login = props.auth.login;

  return (
    <React.Fragment>
      <div className="row head-box">

        <div className="container">

          <div className="row">

            <div className="col-sm-12 col-md-6 big-logo">
            </div>

            <div className="col-sm-12 col-md-6 text-center">
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
          </div>

        </div>

      </div>

      <div className="container">
        <div className="row claim-box text-center">
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h3>Build your team</h3>
            <p>
              Choose three champions from the available classes.
              What do you think will be most useful to you: the cunning
              of a Project Manager or the brute force of a Dev? Perhaps
              the subterfuges of a Marketer...
            </p>
          </div>
          <div className="col-md-6 text-center">
            <img src={dev} alt="Dev"/>
          </div>
        </div>

        <div className="row claim-box text-center">
          <div className="col-md-6 text-center">
            <Terminal/>
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h3>Program your AI</h3>
            <p>
              A simple set of APIs will allow you to choose how your
              soldiers will fight in the arena.
              Remember, it's no place for a brat!
            </p>
          </div>

        </div>

        <div className="row claim-box text-center">
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h3>Test your bots</h3>
            <p>
              Test your team against all the available bots: if you can't
              beat them, it will be very difficult to reach a good
              position in the ranking
            </p>
          </div>
          <div className="col-md-6 text-center">
            <img src={mktg} alt="Mktg"/>
          </div>
        </div>

        <div className="row claim-box">
          <div className="col-md-6 text-center">
            <img src={pm} alt="PM"/>
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h3>Be the best</h3>
            <p>
              Send your team into the arena to fight. It will fight against
              all the other players' teams twice. A net win is worth 3 points.
              A draw won is worth 1 point. Which team will be the best?
            </p>
          </div>

        </div>
      </div>


      <Footer></Footer>


    </React.Fragment>
  )
}

export default Homepage;
