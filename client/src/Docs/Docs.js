import React from 'react';

const Docs = (props) => (


  <div className="container">
    <div className="row">
      <div className="col-sm-12 section-title text-center">
        <h1>Super Ultra Dev Fight Arena</h1>
      </div>
    </div>

    <div className="row">
      <div className="col-sm-12">
        <h2>What is it?</h2>
      </div>
      <div className="col-sm-12">
        <p>
          Super Ultra Dev Fight Arena (SUDFA) is an AI programming game.
        </p>
      </div>
    </div>


    <div className="row">
      <div className="col-sm-12">
        <h2>How does it work?</h2>
      </div>
      <div className="col-sm-12">
        <p>
          The game lets you code your bots and challenge all other players in a giant
          royal rumble arena, where only the best AI can thrive.
        </p>
      </div>
    </div>


    <div className="row">
      <div className="col-sm-12">
        <h2>How does a fight work?</h2>
      </div>
      <div className="col-sm-12">
        <p>
          Each bot is made up of a team of three characters, which can be combined as required between the <a href="#classes">available classes</a>.
        </p>
        <p>
          A league fight takes place in 2 rounds,
          so that each team has a chance to start first.
        </p>
        <p>
          A round is a series of alternating rounds (maximum 100), where the components of the
          two teams alternate and may perform <b>only one action per turn</b>.
          If you have played a JRPG in the past, you will surely already be aware of the system.
        </p>
        <p>
          It is not possible to change the order of the soldiers on the field at runtime, so be careful not only
          to whom you choose, but also to the order in which you arrange them!
        </p>
      </div>
    </div>


    <div className="row">
      <div className="col-sm-12">
        <h2>Team code</h2>
      </div>
      <div className="col-sm-12">
        <p>
          A bot is a Javascript class (node version > 11). It must have a <code>constructor</code> and a <code>run()</code> method.
        </p>
        <p>
          The constructor is executed only once at the start of the match; the run method instead is performed
          at each player's turn.
        </p>
          <p>The available APIs allow you to have
          references to your own team and to the opposing team and to perform all actions
          necessary to win the fight.
        </p>
      </div>
    </div>


    <div className="row">
      <div className="col-sm-12">
        <h2>Creation of the team</h2>
      </div>
      <div className="col-sm-12">
        <p>
          Within the constructor you need to define a `team` object that must contain the name and shape of the team.
        </p>
        <code>
          <pre>
            {`
constructor(game) {

  // ref to the game object
  this.game = game;

  this.team = {
    name: 'Team name', // the name, you can change it anytime you want it
    troops: [
      game.Dev(), //
      game.Pm(),  // max 3 soldiers
      game.Mktg() //
    ]
  }

}
          `}
          </pre>
        </code>

      </div>
    </div>


    <div className="row">
      <div className="col-sm-12">
        <h2>Turn Execution</h2>
      </div>
      <div className="col-sm-12">
        <p>
          At each turn of one of your team's soldiers, the `run()`method will be launched.
          In it you have to put the execution code of the turn: you have to analyze the
          state of your team and that of the opponent, identify the action to be
          taken and finally perform the action chosen.
        </p>
        <p>
          You can only do one action per
          turn: if you try to do two or more actions, the entire turn will be cancelled
          and you will pass the hand to the opponent.
        </p>
      </div>
    </div>


  </div>

)

export default Docs;
