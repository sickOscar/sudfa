import React from 'react';
import './League.scss';

const HOST = window.location.protocol + '//' + window.location.hostname + ':5000';

export default class League extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      leaderboard: []
    };
  }

  componentDidMount() {
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

  render() {
    return (
      <div className="row">

        <div className="col-sm-12 text-center section-title">
          <h1>League leaderboard</h1>
        </div>

        <div className="col-sm-12">
          <ol className="leaderboard">
            {this.state.leaderboard.map((bot, i) => {
              return <li className="leaderboard-row" key={bot.botid}>
                <span>{i + 1}.</span>
                <span>{bot.name}
                  <small>@{bot.username}</small></span>
                <span>({bot.victories} victories)</span>
              </li>
            })}
          </ol>

        </div>

      </div>
    )
  }

}
