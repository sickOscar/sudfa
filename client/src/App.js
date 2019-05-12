import React, { Component } from 'react';
import './App.css';
import SplitPane from 'react-split-pane'
import {Editor} from './Editor';
import {GameResults} from './GameResults';

const exampleCode = `
class Runner {

    constructor(game) {

        this.game = game;
        
        this.team = {
            name: 'Junior', 
            troop: [
                game.Dev(),
                game.Mktg(),
                game.Pm(),
                
            ]
        }

    }


    run() {

        // Your current soldier, which is acting in this turn
        const soldier = this.game.getCurrentSoldier();
        // Reference to the enemy team
        const enemyTeam = this.game.getEnemyTeam();
        // Reference to your team
        const myTeam = this.game.getMyTeam();
        
        // Simple AI
        if (soldier.canCast()) {
            // If the soldier can cast, then cast on all enemies
            soldier.cast();
        } else if (soldier.canHeal()) {
            // if the soldier can heal, then heal the most damaged of your team
            const t = myTeam.getMostDamagedSoldier()
            soldier.heal(t);
        } else {
            // make the soldier hit the most damaged enemy
            const target = enemyTeam.getMostDamagedSoldier();
            soldier.hit(target);
        }

    }

}

module.exports = Runner;

`

class App extends Component {

  constructor(props) {
    super(props);

    const savedCode = localStorage.getItem('code');

    this.state = {
      code: savedCode || exampleCode
    }
  }

  onCodeChange(value, event) {
    this.setState({
      code: value,
      results: null
    })
  }

  onTestCode() {
    console.log('test code');
    localStorage.setItem('code', this.state.code);

    const HOST = process.env.NODE_ENV === 'production' ? 'http://jsfight.herokuapp.com:5000' : 'http://localhost:5000';

    fetch(`${HOST}/source`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: this.state.code
      })
    })
      .then(response => response.json())
      .then(results => {
        this.setState({results})
      })
      .catch(err => console.err(err))

  }

  render() {
    return (
      <SplitPane
        split="vertical"
        minSize={30}
        defaultSize={'50%'}
        className="primary"
      >
        <Editor code={this.state.code} onChange={this.onCodeChange.bind(this)}></Editor>
        <SplitPane split="horizontal" defaultSize={'50%'}>
          <div>API</div>
          <GameResults results={this.state.results} onTestCode={this.onTestCode.bind(this)}></GameResults>
        </SplitPane>
    </SplitPane>
    );
  }
}

export default App;
