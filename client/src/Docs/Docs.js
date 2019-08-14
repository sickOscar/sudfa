import React from 'react';
import Footer from '../Footer/Footer';
import './Docs.scss';

import developer from '../images/personaggi/dev.png';
import pm from '../images/personaggi/po.png';
import marketer from '../images/personaggi/mktg.png';
import hr from '../images/personaggi/hr.png';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Helmet} from "react-helmet";

import Highlight from 'react-highlight'

const Docs = (props) => (
  <React.Fragment>

    <Helmet>
      <title>Docs - Super Ultra Dev Fighter Arena</title>
      <meta name="description" content="Some hints on how the game works" />
    </Helmet>

    <div className="container">


      <div className="row">
        <div className="col-sm-12 section-title text-center">
          <h1>Super Ultra Dev Fighter Arena</h1>
        </div>
      </div>


      <div className="row no-gutters">

        <div className="col-md-3 nav-container">
          <div className="p-3">

            <nav>
              <ul className="nav-list">
                <li>
                  <a href="#what-is-it">What is it?</a>
                </li>
                <li>
                  <a href="#how-does-it-work">How does it work?</a>
                </li>
                <li>
                  <a href="#how-does-a-fight-work">How does a fight work?</a>
                </li>
                <li>
                  <a href="#the-code">The code</a>
                </li>
                <li>
                  <a href="#classes">Classes</a>
                </li>
              </ul>
            </nav>

          </div>
        </div>
        <div className="col-md-9">
          <div className="card p-3">

            <div className="row">
              <div className="col-sm-12">
                <h2 id="what-is-it">What is it?</h2>
              </div>
              <div className="col-sm-12">
                <p>
                  Super Ultra Dev Fight Arena (SUDFA) is an AI programming game.
                </p>
              </div>
            </div>

            <div className="font-row">
              <FontAwesomeIcon icon="fist-raised"/>
            </div>


            <div className="row">
              <div className="col-sm-12">
                <h2 id="how-does-it-work">How does it work?</h2>
              </div>
              <div className="col-sm-12">
                <p>
                  The game lets you code your bots and challenge all other players in a giant
                  royal rumble arena, where only the best AI can thrive.
                </p>
              </div>
            </div>

            <div className="font-row">
              <FontAwesomeIcon icon="bolt"/>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <h2 id="how-does-a-fight-work">How does a fight work?</h2>
              </div>
              <div className="col-sm-12">
                <p>
                  Each bot is made up of a team of three characters, which can be combined as required between the <a
                  href="#classes">available classes</a>.
                </p>
                <p>
                  A league fight takes place in 2 rounds,
                  so that each team has a chance to start first.
                </p>
                <p>
                  A round is a series of alternating turns (maximum 100), where the components of the
                  two teams alternate and may perform <b>only one action per turn</b>.
                  If you have played a JRPG in the past, you will surely already be aware of the system.
                </p>
                <p>
                  It is not possible to change the order of the soldiers on the field at runtime, so be careful not only
                  to whom you choose, but also to the order in which you arrange them!
                </p>
              </div>
            </div>



            <div className="font-row">
              <FontAwesomeIcon icon="skull-crossbones"/>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <h2  id="the-code">The code</h2>
              </div>
              <div className="col-sm-12">
                <p>
                  A bot is a Javascript class (node version > 11). It must have a <code>constructor</code> and
                  a <code>run()</code> method.
                </p>
                <p>
                  The constructor is executed only once at the start of the match; the run method instead is performed
                  at each player's turn.
                </p>
                <p>The available APIs allow you to have
                  references to your own team and to the opposing team and to perform all actions
                  necessary to win the fight.
                </p>
                <p>
                  <b>KEEP IN MIND </b> that it's a Javascript class like any other
                  (note also the final <code>module.exports</code> syntax, which is mandatory).
                  You can use all the tools provided by the language, so don't be afraid
                  to create new methods and fields in the class to help you.
                </p>
              </div>
            </div>


            <div className="row">
              <div className="col-sm-12">
                <h3>Create the team</h3>
              </div>
              <div className="col-sm-12">
                <p>
                  Within the constructor you need to define a `team` object that must contain the name and shape of the
                  team.
                </p>

                <Highlight language="javascript">
            {
              `
class Runner { 
        
    ...
    
    constructor(game) {

      // ref to the game object
      this.game = game;

      this.team = {
        name: 'Team name', // the team name, you can change it anytime you want
        troops: [
          game.Dev({
            name: "Imis Shortcollar", // optional, choose your own name. just for fun
            motto: "My kung fu is better than yours!" // optional, just for fun, used only for events
          }),
          game.Pm(),
          game.Mktg() // max 3 soldiers
        ]
      }

    }

    ...

}
`
            }
                </Highlight>

                <p>
                  In this example we included a dev, a pm and a marketer. You can compose your team with the combination of classes you prefer
                </p>

              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <h3>Turn Execution</h3>
              </div>
              <div className="col-sm-12">
                <p>
                  At each turn of one of your team's soldiers, the <code>run()</code> method will be launched.
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


            <div className="row">
              <div className="col-sm-12">
                <h3>Test the code</h3>
              </div>
              <div className="col-sm-12">
                <p>
                  Before you send your team to fight furiously in the arena against all the
                  other teams of other players, you have 2 chances to test your code:
                </p>
                <ul className="mt-3">
                  <li>
                    You can fight against bots programmed by the arena organizers. They are
                    bots of increasing difficulty. Nothing unbeatable, but you will not
                    emerge victorious from the arena if your bot can't overcome all the enemies we've prepared.
                  </li>
                  <li>
                    You can fight against other players' bots: select your enemy and test
                    your bot against it. You can test only one of the two fights that will take
                    place in the arena, which is where you're first to go. In any case, you will
                    have the opportunity to test your team with the top guys in the leaderboard.
                    Don't get down if at the beginning it will seem an unbeatable challenge for your team,
                    with time and recoding you will surely improve.
                  </li>
                </ul>

              </div>
            </div>

            <div className="font-row">
              <FontAwesomeIcon icon="hospital-symbol"/>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <h2 id="classes">Classes</h2>
              </div>
              <div className="col-sm-12">
                <p>
                  You can build your team by joining three characters. There are no other rules on team composition, so try
                  all the combinations and choose the one that works best for your combat strategy.
                </p>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-sm-12">
                <h3>Developer</h3>
              </div>
              <div className="col-sm-12">
                <img className="class-image" src={developer} alt="The Developer"/>

                <p>
                  The Developer is a war machine. Its powerful attacks will make your opponents tremble with fear. It has
                  many
                  health points and the most powerful attack between classes. His actions are:
                </p>
                <ul>
                  <li>
                    <code>hit(target)</code>: Hits the target by inflicting 3 damage (physical attack).
                  </li>
                  <li>
                    <code>protect(target)</code>: Protects one of your companions for a turn. The protected companion may
                    not suffer damage of any kind.
                  </li>
                </ul>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-sm-12">
                <h3>Project Manager</h3>
              </div>
              <div className="col-sm-12">

                <img className="class-image" src={pm} alt="The Project Manager"/>

                <p>
                  The project manager is your team's brain. Even if he has a discreet attack (2 damage) his main role is to
                  heal his teammates and block the attacks of the opposing team. His actions are:
                </p>
                <ul>
                  <li>
                    <code>hit(target)</code>: Hits the target by inflicting 2 damage (physical attack).
                  </li>
                  <li>
                    <code>heal(target)</code>: Cure a teammate of 5 health points
                  </li>
                  <li>
                    <code>blind(target)</code>: blinds an enemy to prevent him from making a physical attack in his next
                    turn
                  </li>
                  <li>
                    <code>silence(target)</code>: silences an enemy, in his next turn he cannot use a magic ability (cast
                    or
                    cure)
                  </li>
                </ul>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-sm-12">
                <h3>Marketer</h3>
              </div>
              <div className="col-sm-12">

                <img className="class-image" src={marketer} alt="The Marketer"/>

                <p>
                  The marketer is a smart and powerful character. Despite being the weakest and his physical attack being
                  derisory (1dmg), he has magical abilities! He can hit all his enemies or use the poison to inflict a
                  considerable amount of damage over a long period of time. His skills are:
                </p>
                <ul>
                  <li>
                    <code>hit(target)</code>: Hits the target by inflicting 1 damage (physical attack).
                  </li>
                  <li>
                    <code>cast()</code>: hits the entire opposing team, inflicting 1 damage on all members
                  </li>
                  <li>
                    <code>poison(target)</code>: Poisons a member of the opposing team, suddenly inflicting 2 damage and 4
                    damage distributed over the next 2 rounds. If the target is protected, it does not suffer the initial
                    damage but extends the poisoning period.
                  </li>
                </ul>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-sm-12">
                <h3>Human Resources Officer</h3>
              </div>
              <div className="col-sm-12">

                <img className="class-image" src={hr} alt="Human Resources Officer"/>

                <p>
                  Are you afraid of loosing human resources? Do you need an help in the office but you can't afford to hire a new team member? Well
                  the HR Officer is exactly what you need. It can bring back to life one of your dead team members and hire some interns to help you
                  in your dalily routine. His skills are:
                </p>
                <ul>
                  <li>
                    <code>hit(target)</code>: Hits the target by inflicting 1 damage (physical attack).
                  </li>
                  <li>
                    <code>ress(target)</code>: Brings a dead companion back to life with half of it's maximum health
                  </li>
                  <li>
                    <code>summon('physical_attack'|'physical_defense'|'magic_attack'|'magic_defense')</code>: Summon an intern, boosting the stats of the entire team. It has 1HP,
                    it can be killed by physical damage and lasts for 2 rounds.
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>



    </div>

    <Footer/>
  </React.Fragment>

);

export default Docs;
