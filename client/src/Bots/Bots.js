import React from 'react';
import {Link} from 'react-router-dom'
import './Bots.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Bots extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: this.props.auth.getUser(),
      bots: []
    };

  }

  componentDidMount() {

    const HOST = window.location.protocol + '//' + window.location.hostname + ':5000';

    fetch(`${HOST}/mybots`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      }
    })
      .then(response => response.json())
      .then(results => {
        this.setState({bots: results})
      })
      .catch(err => console.error(err))
  }

  render() {

    const newBotId = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const newBotLink = `edit/${newBotId}`

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-sm-12 text-center section-title">
            <h1>{this.state.user ? this.state.user.name : ''}'s teams</h1>
          </div>
        </div>

        <div className="row">


          {this.state.bots.map(bot => {
            const link = `edit/${bot.botid}`;
            return (
              <div className="col-sm-4" key={bot.botid}>
                <div className="card bot-card">
                  <div className="card-body">
                    <h5 className="card-title">{bot.name}</h5>
                    <div className="icon-box">
                      <FontAwesomeIcon icon="robot"/>
                    </div>
                    <Link to={link} className="btn btn-primary">
                      Edit team
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="col-sm-4">
            <div className="card bot-card">
              <div className="card-body">
                <h5 className="card-title">New Bot</h5>
                <div className="icon-box">
                  <FontAwesomeIcon icon="plus-square"/>
                </div>
                <Link to={newBotLink} className="btn btn-primary">
                  Create new team
                </Link>
              </div>
            </div>
          </div>

        </div>


      </React.Fragment>
    )

  }

}
