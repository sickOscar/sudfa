import React from 'react';
import {Link} from 'react-router-dom';

const HOST = 'http://127.0.0.1:5000';

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
            <div>

                <Link to="bots">Back to my bots</Link>

                <h1>League</h1>

                <ol>
                    {this.state.leaderboard.map(bot => {
                        return <li key={bot._id}>
                          {bot.count} -- {bot.name} {bot.botId}
                        </li>
                    })}
                </ol>
            </div>
        )
    }

}
