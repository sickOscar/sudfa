import React, {Component} from 'react';
import SplitPane from 'react-split-pane'
import {Editor} from './Editor/Editor';
import {GameResults} from './GameResults/GameResults';
import Apis from './Apis/Apis';
import history from '../history';
import Env from '../env';
import Joyride from 'react-joyride';

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
      loading: false,
      showOverlay: false,
      mainJoyride: {
        showProgress: true,
        // debug: true,
        continuous: true,
        run: false,
        steps: [
          {
            target: '.editor-container',
            content: 'This is the editor, edit your code here',
            placement: 'right'
          },
          {
            target: '.api-container',
            content: "Here you will find all the API docs you'll need to code your bot",
            placement: 'left'
          },
          {
            target: '.game-results-container',
            content: "Once you'll start a test fight, you will see here the progress of the battle",
            placement: 'left'
          },
          {
            target: '.editor-actions',
            content: "When your code is ready, click 'Fight' to choose a fight option. If you just want to save your bot for later, click 'Save Team' and go back to team selection",
            placement: 'top'
          }
        ]
      }

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
    });


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
    });

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
            error: results.message,
            showOverlay: true
          })
        } else {
          this.setState({
            loading: false
          });
          history.replace(`/queue/${this.props.match.params.botid}`)
        }
      })
      .catch(err => this.props.auth.logout())

  }


  saveBot() {

    this.setState({
      loading: true
    });

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
        });

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
        });

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
        console.error(err);
        this.props.auth.logout()
      });

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
      });

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
      });

    // RUN JOYRIDE IF FIRST ACCESS
    const mainJoyrideDone = localStorage.getItem('mainJoyrideDone');
    if (!mainJoyrideDone || mainJoyrideDone === 'false') {
      this.setState({
        mainJoyride: {
          ...this.state.mainJoyride,
          run: true
        }
      })
    }


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
    });

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

  closeOverlay() {
    this.setState({
      showOverlay: false
    })
  }

  checkMainJoyride(state) {
    if (state.action === 'reset') {
      localStorage.setItem('mainJoyrideDone', 'true');
    }
  }

  render() {

    const splitPaneStyles = {
      position: 'static'
    };

    return (
      <div className="split-pane-container">

        <Joyride
          {...this.state.mainJoyride}
          callback={this.checkMainJoyride.bind(this)}
        />



        {this.state.showOverlay && (
          <div className="overlay">
            <div className="overlay-content">
              <h3>Ok, let's face it,</h3>
              <h2>Something went terribly wrong</h2>
              <p>Maybe your code has errors, maybe our code has errors. Who knows?</p>

              <p>Maybe this is all a nightmare and you will soon wake up all greasy and sweaty.</p>

              <p>Only time will tell us</p>

              <p><b>PS: Are you really sure your code is correct? Just saying...</b></p>

              <button onClick={this.closeOverlay.bind(this)} className="btn btn-primary">
                Close this thing
              </button>
            </div>
          </div>
        )}

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

          <SplitPane split="horizontal" defaultSize={'50%'}
                     pane2Style={{overflow: 'hidden'}}>

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
