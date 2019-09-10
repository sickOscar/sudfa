import React from 'react';
import './EditorActions.scss';
import Select from 'react-select';
import Joyride from 'react-joyride';
import {Button, Header, Heading, Words} from 'arwes';

export default class EditorActions extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectOpen: false,
      timeToSendToLeague: 0,
      tickInterval: 0,
      actionJoyride: {
        showProgress: true,
        debug: true,
        continuous: true,
        run: false,
        steps: [
          {
            target: '.bot-selection-container',
            content: "Here you can test your bot against one of our precoded bots. Don't even think to get to the arena without testing against these bots.",
            placement: "right"
          },
          {
            target: '.challenger-selection-container',
            content: "Here you can have a test fight against another player's bot. Your bot will start first and fight only once; in the real arena you will fight against all other players' bots two times.",
            placement: "right"
          },
          {
            target: '.send-to-arena-container',
            content: "When your bot is really ready, send it to the arena to fight against all other bots! You will have to wait a while for the fights to complete. (max 1 arena send every 5 minutes)",
            placement: "right"
          }
        ]
      }
    };

    this.levels = [
      {
        value: 'junior',
        label: 'Junior'
      },
      {
        value: 'mid-level',
        label: 'Mid-Level'
      },
      {
        value: 'senior',
        label: 'Senior'
      },
      {
        value: 'guru',
        label: 'Guru'
      }
    ];

    this.toggleSelectPane = this.toggleSelectPane.bind(this);


  }

  componentDidMount() {
    this.startCounter();

    // RUN JOYRIDE IF FIRST ACCESS
    const actionJoyrideDone = localStorage.getItem('actionJoyrideDone');
    if (!actionJoyrideDone || actionJoyrideDone === 'false') {
      this.setState({
        actionJoyride: {
          ...this.state.actionJoyride,
          run: true
        }
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.tickInterval);
  }

  closePane(action) {
    this.toggleSelectPane();
    action();
  }

  toggleSelectPane() {
    this.setState({
      selectOpen: !this.state.selectOpen
    })
  }


  startCounter() {
    this.setState({
      tickInterval: setInterval(() => {
        this.setState({
          timeToSendToLeague: (5 * 60 * 1000) - this.getTimeFromLastSendToLeague()
        })
      }, 1000)
    })
  }

  getTimeFromLastSendToLeague() {
    // bot non arrivato ancora
    if (!this.props.bot) {
      return Infinity;
    }
    // bot non è mai stato mandato in league
    if (this.props.bot && !this.props.bot.leagueBot) {
      return Infinity;
    }

    if (this.props.bot && this.props.bot.leagueBot && this.props.bot.leagueBot.timestamp) {
      const now = new Date();
      const sentToLeague = new Date(this.props.bot.leagueBot.timestamp);

      const difference = now - sentToLeague;
      return difference;
    }
    return 0;
  }

  canSendToArena() {
    return this.getTimeFromLastSendToLeague() > 5 * 60 * 1000;
  }

  formatTime(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  checkMainJoyride(state) {
    if (state.action === 'reset') {
      localStorage.setItem('actionJoyrideDone', 'true');
    }
  }

  render() {
    return (
      <div className="editor-actions">

        <Joyride
          {...this.state.actionJoyride}
          callback={this.checkMainJoyride.bind(this)}
        />

        {this.state.selectOpen && (
          <div className="fight-select-pane">

            <div className="bot-selection-container">
              <Header animate className="mb-2">
                <Heading node="h4">Challenge a Bot</Heading>
              </Header>

              <Words animate>
                Test your bot's skills sgaint one of our bots!
              </Words>

              <div className="d-flex">
                <div style={{'flex': 1}}>
                  <select className="form-control" onChange={this.props.onLevelChange}>
                    {this.levels.map(level => {
                      return <option key={level.label} value={level.value}>{level.label}</option>
                    })}
                  </select>
                </div>
                <div style={{'flex': 1}}>
                  <Button animate onClick={this.closePane.bind(this, this.props.onTestCode)}>
                    Fight!
                  </Button>
                </div>
              </div>

            </div>

            <div className="challenger-selection-container">

              <Header animate className="mb-2">
                <Heading node="h4">Challenge another team</Heading>
              </Header>

              <div className="d-flex">
                <div style={{'flex': 1}}>
                  <Select classNamePrefix="select"
                          onChange={this.props.onChallengeTeamSelection}
                          value={this.props.enemyBot && {
                            value: this.props.enemyBot.botid,
                            label: this.props.enemyBot.name
                          }}
                          options={
                            this.props.bots.map(bot => ({value: bot.botid, label: bot.name}))
                          }/>
                </div>
                <div style={{'flex': 1}}>
                  <Button animate className="btn btn-primary" disabled={!this.props.enemyBot}
                          onClick={this.closePane.bind(this, this.props.challenge)}>Fight!
                  </Button>
                </div>
              </div>
            </div>

            <div className="send-to-arena-container">

              <Header animate className="mb-2">
                <Heading node="h4">Send to arena</Heading>
              </Header>

              <div className="d-flex">
                <div style={{'flex': 1}}>
                  {this.canSendToArena()
                    ? <Button animate
                              onClick={this.closePane.bind(this, this.props.sendToLeague)}>Fight!
                    </Button>
                    : <p>wait {this.formatTime(this.state.timeToSendToLeague)}</p>
                  }
                </div>
              </div>

            </div>
          </div>
        )}


        <Button style={{'flex': 1}} className={this.state.selectOpen ? "btn-selected" : ""}
                disabled={this.props.loading} onClick={this.toggleSelectPane}>
          {this.props.loading ? 'Fighting...' : 'Fight!'}
        </Button>
        <Button style={{'flex': 1}} disabled={this.props.loading} onClick={this.props.saveBot}>
          Save Team
        </Button>


      </div>
    )
  }

}
