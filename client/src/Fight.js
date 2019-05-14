import React from 'react';
import {Link} from 'react-router-dom'

export default class Fight extends React.Component {

  constructor(props) {
    super(props);

    const bot1Id = this.props.match.params.bot1;
    const bot2Id = this.props.match.params.bot2;

    this.state = {
      bot1Id,
      bot2Id,
      bots: [
      ],
      fights: []
    };

  }

  componentDidMount() {

    const HOST = 'http://' + window.location.hostname + ':5000';

    fetch(`${HOST}/fight/${this.state.bot1Id}/${this.state.bot2Id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(results => {
        this.setState({bots: results.bots, fights: results.fights})
      })
      .catch(err => console.error(err))
  }

  render() {

    return (
      <div>

        <h2>Bots</h2>

        {this.state.bots.map(bot => {
          return <div key={bot.botId}>{bot.name}</div>
        })}

        <h2>Fights</h2>

        {this.state.fights.map(fight => {
          return <pre key={fight.botId}>{JSON.stringify(fight, null, 2)}</pre>
        })}

      </div>
    )

  }

}
