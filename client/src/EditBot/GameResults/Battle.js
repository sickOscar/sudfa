import React from 'react';
import './Battle.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Turn from './Turn';


const BASE_TURN_DURATION = 1000;
const SPEED_TURN_DURATION = 200;

export default class Battle extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      playing: true,
      currentTurn: 0,
      turns: [],
      timeout: 0,
      timeoutLength: BASE_TURN_DURATION,
      results: props.results,
      speed: 'normal',
      end: false
    };

  }

  componentDidMount() {
    this.play();
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.results !== state.results) {
      return {
        ...state,
        turns: [],
        currentTurn: 0,
        timeoutLength: BASE_TURN_DURATION,
        results: props.results,
        speed: 'normal',
        end: false
      }
    }
    return null;
  }

  play() {
    this.nextStep();
  }

  nextStep() {
    if (this.state.currentTurn < this.props.results.turns.length) {
      this.addTurn();
      this.setState({
        timeout: setTimeout(() => {
          this.nextStep()
        }, this.state.timeoutLength)
      });
    } else {
      this.setState({
        playing: false,
        speed: 'normal',
        timeout: 0,
        end: true
      })
    }
  }

  addTurn() {
    this.setState({
      turns: [
        this.transformTurn(this.props.results.turns[this.state.currentTurn]),
        ...this.state.turns
      ],
      currentTurn: this.state.currentTurn + 1,
    })
  }

  pause() {
    clearTimeout(this.state.timeout);
    this.setState({
      timeout: 0
    })
  }

  reload() {
    clearTimeout(this.state.timeout);
    this.setState({
      turns: [],
      currentTurn: 0,
      timeout: 0,
      timeoutLength: BASE_TURN_DURATION,
      playing: false,
      speed: 'normal',
      end: false
    });
    // this.nextStep();
  }

  stepForward() {
    this.pause();
    if (this.state.currentTurn < this.props.results.turns.length) {
      this.addTurn();
    }
  }

  toggleSpeed() {
    this.setState({
      speed: this.state.speed === 'normal' ? 'fast' : 'normal',
      timeoutLength: this.state.timeoutLength === SPEED_TURN_DURATION ? BASE_TURN_DURATION : SPEED_TURN_DURATION
    })
  }

  transformTurn(turnWithState) {
    const team = this.getSoldierTeam(turnWithState.turn.actor);
    return {
      ...turnWithState,
      index: this.state.currentTurn,
      players: this.props.results.players,
      team
    }
  }

  getSoldierTeam(soldierId) {
    return this.props.results.players.find(player => {
      return player.troop.find(soldier => soldier.id === soldierId)
    });
  }

  togglePlaying() {

    if (!this.state.playing) {
      this.play();
    } else {
      this.pause();
    }

    this.setState({
      playing: !this.state.playing
    })

  }


  render() {
    return (
      <div className="battle-container">

        <div className="actions-container">
          <button onClick={this.togglePlaying.bind(this)}
                  className={this.state.playing ? "btn btn-icon active" : "btn btn-icon"}>
            <FontAwesomeIcon icon="play"/>
          </button>
          <button onClick={this.togglePlaying.bind(this)}
                  className={!this.state.playing ? "btn btn-icon active" : "btn btn-icon"}>
            <FontAwesomeIcon icon="pause"/>
          </button>
          <button onClick={this.stepForward.bind(this)}
                  className="btn btn-icon">
            <FontAwesomeIcon icon="step-forward"/>
          </button>
          <button onClick={this.toggleSpeed.bind(this)}
                  className={this.state.speed === 'normal' ? "btn btn-icon": "btn btn-icon active"}>
            <FontAwesomeIcon icon="fast-forward"/>
          </button>
          <button onClick={this.reload.bind(this)}
                  className={"btn btn-icon"}>
            <FontAwesomeIcon icon="redo"/>
          </button>
        </div>

        <div className="turns-container">

          {this.state.end && (
            <div className="row end-fight-container">
              <div className="col-sm-4 trophy-container">
                <span className="trophy-icon">
                  <FontAwesomeIcon icon="trophy"/>
                </span>
              </div>
              <div className="col-sm-8">
                <p>The winner is</p>
                <h2 className="winner-name">{this.props.results.exit.winnerName}</h2>
              </div>
            </div>
          )}

          {this.props.results && this.state.turns.map((turn, i) => (
            <Turn turn={turn} key={i}/>
          ))}
        </div>

      </div>
    )
  }

}
