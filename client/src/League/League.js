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
import Leaderboard from "../Leaderboard/Leaderboard";

import {Frame} from 'arwes';

export default class League extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      leaderboard: null,
      logged: false,
      bots: [],
      group: null,
      openRows: []
    };

    this.icons = {
      'dev': dev_icon,
      'pm': pm_icon,
      'mktg': mktg_icon,
      'hr': hr_icon
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("prevProps", prevProps);
    console.log("this.props.group", this.props.match.params.groupid);
    if (
      (!prevProps.match.params.groupid && this.props.match.params.groupid)
      || (prevProps.match.params.groupid && !this.props.match.params.groupid)
    ) {
      this.reloadData();
    }
  }

  componentDidMount() {
    this.reloadData()
  }

  reloadData() {
    if (this.props.match.params.groupid) {
      this.getGroup();
    } else {

      this.setState({group: null});
      this.getMainLeaderboard()

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
    }
  }

  getMainLeaderboard() {
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

  getGroup() {
    fetch(`${Env.API_HOST}/group/${this.props.match.params.groupid}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      }
    })
      .then(response => response.json())
      .then(group => {
        this.setState({
          group,
          leaderboard: group.leaderboard
        })
      })
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

  render() {

    const moreInfoBaseClassList = 'more-info d-sm-flex justify-content-between';

    return (

      <React.Fragment>

        <Helmet>
          <title>Leaderboard - Super Ultra Dev Fighter Arena</title>
          <meta name="description" content="How's your team doing? This is the full league leaderboard for the game."/>
        </Helmet>

        <div className="container">
          <div className="row">

            <div className="col-sm-12 text-center section-title">
              <h1>
                {this.state.group ? `${this.state.group.name} League Leaderboard` : 'Main League Leaderboard'}
              </h1>
            </div>
            <div className="col-sm-12">
              <Frame corners={4} className="p-3">


                {this.state.group && this.state.leaderboard ? (
                    <Leaderboard auth={this.props.auth}
                                 board={this.state.leaderboard}
                                 group={this.state.group}/>
                  )
                  : (
                    <Leaderboard auth={this.props.auth}
                                 board={this.state.leaderboard}/>
                  )
                }

              </Frame>
            </div>
          </div>
        </div>
        <Footer/>
      </React.Fragment>

    )
  }

}
