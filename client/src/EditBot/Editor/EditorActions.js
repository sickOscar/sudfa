import React from 'react';
import './EditorActions.scss';
import Select from 'react-select';

export default class EditorActions extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectOpen: false,
      timeToSendToLeague: 0,
      tickInterval: 0
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

  render() {
    return (
      <div className="editor-actions">

        {this.state.selectOpen && (
          <div className="fight-select-pane">

            <div className="row">
              <div className="col-sm-12">
                <p>Challenge a bot</p>
              </div>

              <div className="col-sm-8">
                <select className="form-control" onChange={this.props.onLevelChange}>
                  {this.levels.map(level => {
                    return <option key={level.label} value={level.value}>{level.label}</option>
                  })}
                </select>
              </div>
              <div className="col-sm-4">
                <button className="btn btn-primary" onClick={this.closePane.bind(this, this.props.onTestCode)}>Fight!
                </button>
              </div>

            </div>

            <div className="row">
              <div className="col-sm-12">
                <p>Challenge another team</p>
              </div>

              <div className="col-sm-8">
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

              <div className="col-sm-4">
                <button className="btn btn-primary" disabled={!this.props.enemyBot}
                        onClick={this.closePane.bind(this, this.props.challenge)}>Fight!
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <p>Send to arena</p>
              </div>

              <div className="col-sm-8">
                <p>Ready to rumble? {}</p>
              </div>

              <div className="col-sm-4">
                {this.canSendToArena()
                  ? <button className="btn btn-primary"
                            onClick={this.closePane.bind(this, this.props.sendToLeague)}>Fight!
                  </button>
                  : <p>wait {this.formatTime(this.state.timeToSendToLeague)}</p>
                }
              </div>


            </div>
          </div>
        )}

        <button className={this.state.selectOpen ? "btn btn-primary btn-selected" : "btn btn-primary"}
                disabled={this.props.loading} onClick={this.toggleSelectPane}>
          {this.props.loading ? 'Fighting...' : 'Fight!'}
        </button>
        <button className="btn btn-primary" disabled={this.props.loading} onClick={this.props.saveBot}>
          Save Team
        </button>

      </div>
    )
  }

}
