import React, {Component} from 'react';
import SplitPane from 'react-split-pane'
import {Editor} from './Editor';
import {GameResults} from './GameResults';
import Apis from './Apis';
import history from './history';

import './EditBot.css';

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
      selectedLevel: 'junior',
      error: null
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
        'Authorization': `Bearer ${this.props.auth.getToken()}`
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
      .catch(err => {
        console.error(err)
        // this.props.auth.logout()
      })

  }

  sendToLeague() {
    localStorage.setItem('code', this.state.code);

    this.setState({
      error: null
    })

    fetch(`${HOST}/league`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      },
      body: JSON.stringify({
        botId: this.props.match.params.botId,
        source: this.state.code
      })
    })
      .then(response => response.json())
      .then(results => {
        if (results.exit === 'KO') {
          this.setState({error: results.message})
        } else {
          history.replace('/league');
        }
      })
      .catch(err => this.props.auth.logout())

  }

  componentDidMount() {

    fetch(`${HOST}/bot/${this.props.match.params.botId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      }
    })
      .then(response => response.json())
      .then(bot => {
        this.setState({
          bot: bot,
          code: bot ? bot.source : exampleCode
        })
      })
      .catch(err => {
        console.error(err)
        this.props.auth.logout()
      })

    fetch(`${HOST}/API`, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'text/plain'
      }
    })
      .then(response => response.text())
      .then(content => {
        this.setState({
          content
        })
      })
      .catch(err => {
        console.error(err)
      })


  }

  render() {
    return (
      <SplitPane
        split="vertical"
        minSize={30}
        defaultSize={'50%'}
        className="primary"
      >

        <Editor code={this.state.code} onChange={this.onCodeChange.bind(this)}/>

        <SplitPane split="horizontal" defaultSize={'50%'}>

          <Apis content={this.state.content}/>

          <GameResults results={this.state.results}
                       selectedLevel={this.state.selectedLevel}
                       onTestCode={this.onTestCode.bind(this)}
                       onLevelChange={this.onLevelChange.bind(this)}
                       sendToLeague={this.sendToLeague.bind(this)}
                        error={this.state.error}
          />

        </SplitPane>
      </SplitPane>
    );


  }
}
