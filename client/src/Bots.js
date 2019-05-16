import React from 'react';
import {Link} from 'react-router-dom'

export default class Bots extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: this.props.auth.getUser(),
            bots: [
            ]
        };

    }

    componentDidMount() {
        
        const HOST = 'http://' + window.location.hostname + ':5000';

        fetch(`${HOST}/mybots`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${this.props.auth.getToken()}`
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
        
            <div>
                <h1>{this.state.user ? this.state.user.name: ''}'s teams</h1>

                <ul>
                    {this.state.bots.map(bot => {
                        const link = `edit/${bot.botId}`
                        return (
                            <li key={bot.botId}>
                                <Link to={link}>
                                    {bot.name} ({bot.botId})
                                </Link>
                            </li>
                        )
                    })}
                    <li>
                        {}
                        <Link to={newBotLink}>
                            New Team
                        </Link>
                    </li>
                </ul>
            </div> 
        )
        
    }

}
