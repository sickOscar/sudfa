import React from 'react';
import './League.scss';
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import MyBotsFights from './MyBotsFights';
import Env from '../env';

import dev_icon from '../images/dev_icon.jpeg';
import pm_icon from '../images/pm_icon.jpeg';
import mktg_icon from '../images/mktg_icon.jpeg';
import hr_icon from '../images/hr_icon.jpeg';

// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Footer from "../Footer/Footer";
import {Helmet} from "react-helmet";

export default class League extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      leaderboard: [],
      logged: false,
      bots: [],
      openRows: []
    };

    this.icons = {
      'dev': dev_icon,
      'pm': pm_icon,
      'mktg': mktg_icon,
      'hr': hr_icon
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
                top: el ? el.getBoundingClientRect().top - 200 : 0,
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

  toggleMoreInfo(bot) {

    const index = this.state.openRows.indexOf(bot.botid);
    if (index > -1) {
      const newArray = Array.from(this.state.openRows)
      newArray.splice(index, 1)

      this.setState({
        openRows: newArray
      })
    } else {
      this.setState({
        openRows: this.state.openRows.concat([bot.botid])
      })
    }

  }


  // createPopover(botid) {
  //   return <MyBotsFights botid={botid} mybots={this.state.bots}/>;
  // }

  render() {

    const moreInfoBaseClassList = 'more-info d-sm-flex justify-content-between';

    return (

      <React.Fragment>

        <Helmet>
          <title>Leaderboard - Super Ultra Dev Fighter Arena</title>
          <meta name="description" content="How's your team doing? This is the full league leaderboard for the game." />
        </Helmet>

        <div className="container">
          <div className="row">

            <div className="col-sm-12 text-center section-title">
              <h1>League leaderboard</h1>
            </div>

            <div className="col-sm-12">
              <table className="leaderboard">
                <tbody>

                {this.state.leaderboard.map((bot, i) => {
                  return <tr
                    onClick={this.toggleMoreInfo.bind(this, bot)}
                    className={this.props.match.params.botid && this.props.match.params.botid === bot.botid ? "leaderboard-row active" : "leaderboard-row"}
                    key={bot.botid}
                    id={`bot-${bot.botid}`}
                  >

                    <td className="position list__cell">
                      {i + 1}
                    </td>

                    {/*<td className="watch">*/}
                    {/*  {this.state.bots.length > 0 && !(this.state.bots.find(b => b.botid === bot.botid)) &&*/}
                    {/*  <span className="watch-container">*/}
                    {/*  <OverlayTrigger trigger="click" placement="right" overlay={this.createPopover(bot.botid)}>*/}
                    {/*    <FontAwesomeIcon id={bot.botid + '-popover-placement'} className="watch-icon" icon="eye"/>*/}
                    {/*  </OverlayTrigger>*/}
                    {/*</span>*/}
                    {/*  }*/}
                    {/*</td>*/}

                    <td className="name">
                      <div className="text-container">
                        <span className="text">{bot.name.substr(0, 40)}</span>
                        <div className={this.state.openRows.includes(bot.botid) ? (moreInfoBaseClassList + ' open') : moreInfoBaseClassList} >
                          <div className="stats-container">
                            <span className="wins__value">Victories by defeat : {bot.wins || 0}</span><br/>
                            <span className="ties__value">Victories by tie: {bot.ties || 0}</span>
                          </div>
                          {this.props.auth.isAuthenticated()
                            && this.state.openRows.includes(bot.botid)
                            && !(this.state.bots.find(b => b.botid === bot.botid))
                            && <div className="your-bots-fights">
                            <MyBotsFights botid={bot.botid} mybots={this.state.bots}/>
                          </div>}
                        </div>
                      </div>
                      <div className="team d-none d-sm-flex">
                        {bot.team && bot.team.map((soldier, i) => {
                          return (
                            <div key={i} className="soldier">
                              <img src={this.icons[soldier]} alt={soldier}/>
                            </div>
                          )
                        })}
                      </div>

                    </td>

                    <td className="d-none d-sm-table-cell username">
                      {bot.username.substr(0, 40)}
                    </td>


                    <td className="points">
                      <span className="points__value">{bot.points || 0}</span><br/>
                      <span className="points__label">points</span>
                    </td>

                  </tr>
                })}
                </tbody>
              </table>

            </div>

          </div>
        </div>
        <Footer />
      </React.Fragment>

    )
  }

}
