import React, { Component } from 'react';
import './App.css';
import SplitPane from 'react-split-pane'
import {Editor} from './Editor';
import {GameResults} from './GameResults';
import history from './history';

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
        const target = enemyTeam.getMostDamagedSoldier();
        soldier.hit(target);

    }

}

module.exports = Runner;

`
const HOST = 'http://127.0.0.1:5000';

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      bot: null,
      code: exampleCode,
      results: null,
      selectedLevel: 'junior'
    }
  }


  onCodeChange(value, event) {
    this.setState({
      code: value
    })
  }

  onLevelChange(event) {
    this.setState({
      selectedLevel: event.target.value
    })
  }

  onTestCode() {
    localStorage.setItem('code', this.state.code);

    fetch(`${HOST}/source`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${this.props.auth.idToken}`
      },
      body: JSON.stringify({
        bot: this.props.match.params.botId,
        source: this.state.code,
        level: this.state.selectedLevel
      })
    })
      .then(response => response.json())
      .then(results => {
        this.setState({results})
      })
      .catch(err => console.error(err))

  }

  sendToLeague() {
    localStorage.setItem('code', this.state.code);

    fetch(`${HOST}/league`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${this.props.auth.idToken}`
      },
      body: JSON.stringify({
        botId: this.props.match.params.botId,
        source: this.state.code
      })
    })
      .then(response => response.json())
      .then(results => {
        this.setState({results})
        history.replace('/league');
      })
      .catch(err => console.error(err))

  }

  componentDidMount() {
    const { renewSession } = this.props.auth;

    if (localStorage.getItem('isLoggedIn') === 'true') {
      renewSession();
      
    }

    fetch(`${HOST}/bot/${this.props.match.params.botId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${this.props.auth.idToken}`
      }
    })
      .then(response => response.json())
      .then(bot => {
        this.setState({
          bot:bot,
          code: bot.source
        })
      })
      .catch(err => console.error(err))

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
        <GameResults results={this.state.results} 
            selectedLevel={this.state.selectedLevel}
            onTestCode={this.onTestCode.bind(this)}
            onLevelChange={this.onLevelChange.bind(this)}
            sendToLeague={this.sendToLeague.bind(this)}></GameResults>
        </SplitPane>
    </SplitPane>
    );
    

  }
}
