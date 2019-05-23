import React, {Component} from 'react';
import SplitPane from 'react-split-pane'
import {Editor} from './Editor/Editor';
import {GameResults} from './GameResults/GameResults';
import Apis from './Apis/Apis';
import history from '../history';
import Env from '../env';

import './EditBot.scss';

const exampleCode = `
class Runner {

    constructor(game) {

        this.game = game;
        
        this.team = {
            name: "__TEAM_NAME__", 
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

`;

export default class Home extends Component {

  constructor(props) {
    super(props);

    const user = JSON.parse(localStorage.getItem('user'));

    this.state = {
      bot: null,
      code: exampleCode.replace('__TEAM_NAME__', `${user.name}'s team`),
      results: null,
      selectedLevel: 'junior',
      error: null,
      enemyBot: null,
      bots: [],
      loading: false
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

    this.setState({
      error: null,
      loading: true
    })


    fetch(`${Env.API_HOST}/source`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      },
      body: JSON.stringify({
        bot: this.props.match.params.botid,
        source: this.state.code,
        level: this.state.selectedLevel
      })
    })
      .then(response => response.json())
      .then(results => {
        if (results.error) {
          this.setState({
            error: results.error,
            loading: false
          })
        } else {
          this.setState({
            results,
            loading: false
          })
        }
      })
      .catch(err => {
        console.error(err)
        // this.props.auth.logout()
      })


  }

  sendToLeague() {
    localStorage.setItem('code', this.state.code);

    this.setState({
      loading: true,
      error: null
    })

    fetch(`${Env.API_HOST}/league`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      },
      body: JSON.stringify({
        botid: this.props.match.params.botid,
        source: this.state.code
      })
    })
      .then(response => response.json())
      .then(results => {
        if (results.exit === 'KO') {
          this.setState({
            loading: false,
            error: results.message
          })
        } else {
          this.setState({
            loading: false
          })
          history.replace('/league');
        }
      })
      .catch(err => this.props.auth.logout())

  }


  saveBot() {

    this.setState({
      loading: true
    })

    fetch(`${Env.API_HOST}/bot/${this.props.match.params.botid}`, {
      method: 'POST',
      body: JSON.stringify({
        source: this.state.code
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      }
    })
      .then(response => response.json())
      .then(bot => {

        this.setState({
          loading: false
        })

        if (bot.error) {
          this.setState({
            error: bot.error
          })
        } else {
          history.replace('/bots')
        }


      })
      .catch(err => {

        this.setState({
          loading: false
        })

        console.error(err)
        // this.props.auth.logout()
      })

  }

  componentDidMount() {

    fetch(`${Env.API_HOST}/bot/${this.props.match.params.botid}`, {
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
          code: (bot && bot.source) ? bot.source : this.state.code
        })
      })
      .catch(err => {
        console.error(err)
        this.props.auth.logout()
      })

    fetch(`${Env.API_HOST}/API`, {
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

    fetch(`${Env.API_HOST}/league_bots`, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'text/plain',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      }
    })
      .then(response => response.json())
      .then(bots => {
        this.setState({
          bots
        })
      })
      .catch(err => {
        console.error(err)
      })


  }

  onChallengeTeamSelection(selection) {
    this.setState({
      enemyBot: {
        botid: selection.value,
        name: selection.label
      }
    })
  }

  challengeTeam() {

    this.setState({
      error: null,
      loading: true
    })

    fetch(`${Env.API_HOST}/source`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      },
      body: JSON.stringify({
        bot: this.props.match.params.botid,
        source: this.state.code,
        // level: this.state.selectedLevel,
        challenge: this.state.enemyBot.botid
      })
    })
      .then(response => response.json())
      .then(results => {
        if (results.error) {
          this.setState({
            error: results.error,
            loading: false
          })
        } else {
          this.setState({
            results,
            loading: false
          })
        }


      })
      .catch(err => {
        console.error(err)
        // this.props.auth.logout()
      })
  }

  render() {

    const splitPaneStyles = {
      position: 'static'
    };

    return (
      <div className="split-pane-container">
        <SplitPane
          style={splitPaneStyles}
          split="vertical"
          minSize={30}
          defaultSize={'50%'}
        >

          <Editor code={this.state.code}
                  selectedLevel={this.state.selectedLevel}
                  onTestCode={this.onTestCode.bind(this)}
                  onLevelChange={this.onLevelChange.bind(this)}
                  sendToLeague={this.sendToLeague.bind(this)}
                  challenge={this.challengeTeam.bind(this)}
                  onChallengeTeamSelection={this.onChallengeTeamSelection.bind(this)}
                  bots={this.state.bots}
                  enemyBot={this.state.enemyBot}
                  loading={this.state.loading}
                  saveBot={this.saveBot.bind(this)}
                  bot={this.state.bot}
                  onChange={this.onCodeChange.bind(this)}/>

          <SplitPane split="horizontal" defaultSize={'50%'}>

            <Apis content={this.state.content}/>

            <div style={{overflow: 'hidden', height: '100%'}}>
              <GameResults results={this.state.results}
                           error={this.state.error}
              />
            </div>

          </SplitPane>
        </SplitPane>
      </div>
    );


  }
}
