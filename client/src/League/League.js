import React from 'react';
import './League.scss';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import MyBotsFights from './MyBotsFights';
import Env from '../env';

import dev_icon from '../images/dev_icon.jpeg';
import pm_icon from '../images/pm_icon.jpeg';
import mktg_icon from '../images/mktg_icon.jpeg';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export default class League extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      leaderboard: [],
      logged: false,
      bots: []
    };

    this.icons = {
      'dev': dev_icon,
      'pm': pm_icon,
      'mktg': mktg_icon
    }
  }

  componentDidMount() {

    if (this.props.auth.isAuthenticated()) {
      fetch(`${Env.API_HOST}/myleaguebots`, {
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

          if (this.props.match.params.botid) {
            setTimeout((() => {
              const el = document.querySelector(`#bot-${this.props.match.params.botid}`);
              window.scrollTo({
                top: el ? el.getBoundingClientRect().top - 100 : 0,
                behavior: 'smooth'
              });
            }), 1000)
          }

        })
        .catch(err => console.error(err))

    }


    fetch(`${Env.API_HOST}/leaderboard`, {
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
    return <MyBotsFights botid={botid} mybots={this.state.bots}/>;
  }

  render() {
    return (
      <div className="container">
        <div className="row">

          <div className="col-sm-12 text-center section-title">
            <h1>League leaderboard</h1>
          </div>

          <div className="col-sm-12">
            <ol className="leaderboard">

              <li className="leaderboard-row">
                <div className="position">
                  POS
                </div>

                <div className="watch">
                  STATS
                </div>

                <div className="name">
                  BOT NAME
                </div>

                <div className="username">
                  USER
                </div>

                <div className="wins">
                  KO WINs
                </div>

                <div className="ties">
                  TIES WINs
                </div>

                <div className="points">
                  SCORE
                </div>

              </li>

              {this.state.leaderboard.map((bot, i) => {
                return <li
                  className={this.props.match.params.botid && this.props.match.params.botid === bot.botid ? "leaderboard-row active" : "leaderboard-row"}
                  key={bot.botid}
                  id={`bot-${bot.botid}`}
                >

                  <div className="position">
                    {i + 1}
                  </div>

                  <div className="watch">
                    {this.state.bots.length > 0 && !(this.state.bots.find(b => b.botid === bot.botid)) &&
                    <span className="watch-container">
                      <OverlayTrigger trigger="click" placement="right" overlay={this.createPopover(bot.botid)}>
                        <FontAwesomeIcon id={bot.botid + '-popover-placement'} className="watch-icon" icon="eye"/>
                      </OverlayTrigger>
                    </span>
                    }
                  </div>

                  <div className="name">
                    <span className="text">{bot.name}</span>
                    <div className="team">
                      {bot.team && bot.team.map((soldier, i) => {
                        return (
                          <div key={i} className="soldier">
                            <img src={this.icons[soldier]} alt={soldier}/>
                          </div>
                        )
                      })}
                    </div>
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
      </div>
    )
  }

}
