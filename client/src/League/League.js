import React from 'react';
import './League.scss';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import MyBotsFights from './MyBotsFights';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const HOST = window.location.protocol + '//' + window.location.hostname + ':5000';

export default class League extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      leaderboard: [],
      logged: false,
      bots: []
    };
  }

  componentDidMount() {

    if (this.props.auth.isAuthenticated()) {
      fetch(`${HOST}/mybots`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.auth.getToken()}`
        }
      })
        .then(response => response.json())
        .then(bots => {
          this.setState({bots})
        })
        .catch(err => console.error(err))

    }


    fetch(`${HOST}/leaderboard`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(leaderboard => {
        this.setState({leaderboard})
      })
      .catch(err => console.error(err))

  }


  createPopover(botid) {
    return <MyBotsFights botid={botid} mybots={this.state.bots} />;
  }

  render() {
    return (
      <div className="row">

        <div className="col-sm-12 text-center section-title">
          <h1>League leaderboard</h1>
        </div>

        <div className="col-sm-12">
          <ol className="leaderboard">

            <li className="leaderboard-row" >
              <div className="position">
                POS
              </div>

              <div className="name">
                BOT NAME
              </div>

              <div className="username">
                USER
              </div>

              <div className="wins">
                WINS
              </div>

              <div className="ties">
                TIES
              </div>

              <div className="points">
                SCORE
              </div>

            </li>

            {this.state.leaderboard.map((bot, i) => {
              return <li className="leaderboard-row" key={bot.botid}>

                <div className="position">
                  {i + 1}
                </div>

                <div className="name">
                  {bot.name}
                  {this.state.bots.length > 0 &&
                    <span className="watch-container">
                      <OverlayTrigger  trigger="click" placement="right" overlay={this.createPopover(bot.botid)}>
                        <FontAwesomeIcon id={bot.botid + '-popover-placement'} className="watch-icon" icon="eye" />
                      </OverlayTrigger>
                    </span>
                  }
                </div>

                <div className="username">
                  {bot.username}
                </div>

                <div className="wins">
                  {bot.wins || 0}
                </div>

                <div className="ties">
                  {bot.ties || 0}
                </div>

                <div className="points">
                  {bot.points || 0}
                </div>

              </li>
            })}
          </ol>

        </div>

      </div>
    )
  }

}
