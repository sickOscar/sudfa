import React from 'react';
import './Apis.scss';
import {Header, Heading, Button, Words, Code} from "arwes";


export default class Apis extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      openApi: 'welcome',

      showPar2: false,
      showPar3: false,
      showPar4: false
    }

    setTimeout(() => {
      this.setState({
        showPar2: true
      })
    }, 1000)

    setTimeout(() => {
      this.setState({
        showPar3: true
      })
    }, 2000)

    setTimeout(() => {
      this.setState({
        showPar4: true
      })
    }, 4000)

  }

  render() {
    return (
      <div className="api-container">
        {/*<h2 className="apis-title">API</h2>*/}

        <Header animate>
          <Heading node="h4">API</Heading>
        </Header>

        <div>
          <ul className="apis-menu">
            <li className={this.state.openApi === 'welcome' && 'active'}>
              <Button onClick={() => this.setState({openApi: 'welcome'})}>Welcome</Button>
            </li>
            <li className={this.state.openApi === 'game' && 'active'}>
              <Button onClick={() => this.setState({openApi: 'game'})}>Game</Button>
            </li>
            <li className={this.state.openApi === 'team' && 'active'}>
              <Button onClick={() => this.setState({openApi: 'team'})}>Team</Button>
            </li>
            <li className={this.state.openApi === 'soldier' && 'active'}>
              <Button onClick={() => this.setState({openApi: 'soldier'})}>Soldier</Button>
            </li>
            <li className={this.state.openApi === 'examples' && 'active'}>
              <Button onClick={() => this.setState({openApi: 'examples'})}>Examples</Button>
            </li>
          </ul>
        </div>


        <div className="api-content">

          {this.state.openApi === 'welcome' && <div className="row welcome-content">


            <div className="col-sm-12 text-center my-2">
              <Heading node="h3">Welcome to the editor!</Heading>
            </div>

            <div className="col-sm-12 text-center">
              <p>
                <Words animate animation={{timeout: 1000}}>You got this far, that's great!</Words>
              </p>

              <p>
                <Words animate animation={{timeout: 1000}} show={this.state.showPar2}>Now it's time to write some
                  code.</Words>
              </p>
              <p>
                <Words animate animation={{timeout: 2000}} show={this.state.showPar3}>
                  Write your bot's AI, test it first against one of our bots. When you're satisfied, get him on the
                  battlefield to join the league!
                </Words>
              </p>

              <p>
                <Words animate animation={{timeout: 2000}} show={this.state.showPar4}>
                  Each box here has its own purpose, we recommend that you follow the short tutorial by pressing the red
                  circle.
                </Words>

              </p>
            </div>

          </div>}

          {this.state.openApi === 'game' && <div>

            <p>The game object has the following methods:</p>

            <ul>
              <li><strong><code>getCurrentSoldier()</code></strong>:<em>Soldier</em> -&gt; get the current soldier</li>
              <li><strong><code>getEnemyTeam()</code></strong>:<em>Team</em> -&gt; reference to the enemy team</li>
              <li><strong><code>getMyTeam()</code></strong>:<em>Team</em> -&gt; reference to your team</li>
            </ul>


          </div>}

          {this.state.openApi === 'team' && <div>

            <p>Once you get a team object (your team or the opposite team), here's what you can call:</p>

            <ul>
              <li><strong><code>getAliveSoldiers()</code></strong>:<em>Array&lt;Soldier&gt;</em> -&gt; get alive
                soldiers
              </li>
              <li><strong><code>getFirstSoldier()</code></strong>:<em>Soldier</em> -&gt; get the first soldier</li>
              <li><strong><code>getLastSoldier()</code></strong>:<em>Soldier</em> -&gt; get the last soldier</li>
              <li><strong><code>getStrongestSoldier()</code></strong>:<em>Soldier</em> -&gt; get the soldier with the
                highest attack
              </li>
              <li><strong><code>getWeakestSoldier()</code></strong>:<em>Soldier</em> -&gt; get the soldier with the
                lowest
                attack
              </li>
              <li><strong><code>getMostDamagedSoldier()</code></strong>:<em>Soldier</em> -&gt; get the soldier with the
                lowest health
              </li>
              <li><strong><code>getHealer()</code></strong>:<em>Soldier</em> -&gt; get one soldier who can heal</li>
            </ul>

          </div>}

          {this.state.openApi === 'soldier' && <div>
            <h4>COMMON TO ALL SOLDIERS</h4>
            <ul>
              <li><strong><code>getType()</code></strong>:<em>string</em> -&gt; return soldier type</li>
              <li><strong><code>getHealth()</code></strong>:<em>int</em> -&gt; return soldier health</li>
              <li><strong><code>getAttack()</code></strong>:<em>int</em> -&gt; return soldier attack</li>
              <li><strong><code>getName()</code></strong>:<em>string</em> -&gt; return soldier name</li>
              <li><strong><code>getId()</code></strong>:<em>string</em> -&gt; return soldier id</li>
              <li><strong><code>getMaxHealth()</code></strong>:<em>int</em> -&gt; return soldier max health</li>
              <li><strong><code>getStatus()</code></strong>:<em>Array</em> -&gt; return a list containing all soldier
                status. A soldier can be in one or more of the following states:
                <ul>
                  <li>OK: the soldier is alive</li>
                  <li>SILENCED: the soldier is silenced and can't cast, heal or silence</li>
                  <li>BLIND: the soldier can't do any physical attack</li>
                  <li>POISONED: the soldier is poisoned, it will loose 2HP at the end of his next turn</li>
                  <li>PROTECTED: the soldier is protected, the next attack will not harm him (hit or cast)</li>
                  <li>DEAD: the soldier is dead</li>
                </ul>
              </li>
              <li><strong><code>getTotems()</code></strong>:<em>Array</em> -&gt; return an array of the totems summoned
                by that soldier
              </li>
              <li><strong><code>getMotto()</code></strong>:<em>string</em> -&gt; return soldier motto</li>


              <li><strong><code>canHeal()</code></strong>:<em>boolean</em> -&gt; check if soldier can heal</li>
              <li><strong><code>canCast()</code></strong>:<em>boolean</em> -&gt; check if soldier can cast</li>
              <li><strong><code>canSilence()</code></strong>:<em>boolean</em> -&gt; check if soldier can silence</li>
              <li><strong><code>canPoison()</code></strong>:<em>boolean</em> -&gt; check if soldier can poison</li>
              <li><strong><code>canProtect()</code></strong>:<em>boolean</em> -&gt; check if soldier can protect</li>
              <li><strong><code>canBlind()</code></strong>:<em>boolean</em> -&gt; check if soldier can blind</li>
              <li><strong><code>canRess()</code></strong>:<em>boolean</em> -&gt; check if soldier can ress</li>
              <li><strong><code>canSummon()</code></strong>:<em>boolean</em> -&gt; check if soldier can summon</li>


            </ul>
            <h4>DEV (24HP)</h4>
            <ul>
              <li><strong><code>hit(target)</code></strong>:<em>void</em> -&gt; attacks (3dmg) a target (must be an
                enemy soldier)
              </li>
              <li><strong><code>protect(target)</code></strong>:<em>void</em> -&gt; protects a target from the first hit
                or cast until he gets damage
              </li>
            </ul>
            <h4>PM (20 HP)</h4>
            <ul>
              <li><strong><code>hit(target)</code></strong>:<em>void</em> -&gt; attacks (2dmg) a target (must be an
                enemy soldier)
              </li>
              <li><strong><code>heal(target)</code></strong>:<em>void</em> -&gt; heals (5HP) a target (must be one of
                your soldiers)
              </li>
              <li><strong><code>silence(target)</code></strong>:<em>void</em> -&gt; silence a target (can't cast, heal
                or silence) for one turn
              </li>
              <li><strong><code>blind(target)</code></strong>:<em>void</em> -&gt; blinds a target, can't hit for one
                turn
              </li>
            </ul>
            <h4>MKTG (15 HP)</h4>
            <ul>
              <li><strong><code>hit(target)</code></strong>:<em>void</em> -&gt; attacks (1dmg) a target (must be an
                enemy soldier)
              </li>
              <li><strong><code>cast()</code></strong>:<em>void</em> -&gt; cast a spell (1dmg) on all enemies</li>
              <li><strong><code>poison(target)</code></strong>:<em>void</em> -&gt; poison an enemy. Deals 2dmg, then
                2dmg per turn for 2 turns. If the enemy is already poisoned, it doesn't deal initial damage but extends
                poison duration.
              </li>
            </ul>
            <h4>HR (18HP)</h4>
            <ul>
              <li><strong><code>hit(target)</code></strong>:<em>void</em> -&gt; attacks (1dmg) a target (must be an
                enemy soldier)
              </li>
              <li><strong><code>ress(target)</code></strong>:<em>void</em> -&gt; ress a target (must be a companion)
                with half of his max health
              </li>
              <li>
                <strong><code>summon('physical_attack'|'physical_defense'|'magic_attack'|'magic_defense')</code></strong>:<em>void</em> -&gt; summons
                a totem (1 round duration) which boosts the stat corresponding to the parameter for the entire team. Max
                3 totems. Totems can be targeted and damaged by physical attacks.
              </li>
            </ul>
          </div>}


          {this.state.openApi === 'examples' && <div>

            <p>Here are some code sample for some common strategies you can apply. </p>

            <div className='code-sample'>
              <Header>
                <Heading node="h4">Hit the weak spot</Heading>
              </Header>
              <p>Your current soldier will hit physically the enemy's most damaged soldier</p>

              <Code type="pre">
                {`
// Your current soldier, which is acting in this turn
const soldier = this.game.getCurrentSoldier();
// Reference to the enemy team
const enemyTeam = this.game.getEnemyTeam();

const target = enemyTeam.getMostDamagedSoldier();
soldier.hit(target);
`}
              </Code>

            </div>

            <div className='code-sample'>
              <Header>
                <Heading node="h4">Heal me if you can</Heading>
              </Header>
              <p>You should have a Pm in your team. The soldier will heal the most damaged soldier of your team if his
                health is not maxed. Otherwise it will attack the enemy's most damaged soldier.</p>

              <Code type="pre">
                {`
// Your current soldier, which is acting in this turn
const soldier = this.game.getCurrentSoldier();
// Reference to the enemy team
const enemyTeam = this.game.getEnemyTeam();
// Reference to your team
const myTeam = this.game.getMyTeam();

// Simple AI

if (soldier.canHeal()) {  
  const target = myTeam.getMostDamagedSoldier();
  soldier.heal(target);        
} else {
  const target = enemyTeam.getMostDamagedSoldier();
  soldier.hit(target);   
   
}
`}
              </Code>

            </div>


          </div>
          }

        </div>


      </div>
    )
  }
}
