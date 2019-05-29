import React from 'react';
import env from '../env';
import './Queue.scss';
import history from "../history";

export default class Queue extends React.Component {

  constructor(props) {
    super(props);
    this.interval = 0;
  }

  tick() {

    fetch(`${env.API_HOST}/queue/${this.props.match.params.botid}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      }
    })
      .then(response => response.json())
      .then(results => {

        if (results.exit === 'OK') {
          history.replace(`/league/${this.props.match.params.botid}`)
        } else {
          console.log('wait...');
        }

      })
      .catch(err => {
        console.error(err);
      })

  }

  componentDidMount() {
    this.interval = setInterval(this.tick.bind(this), 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="queue-container">
        <div className="loader"></div>
        <h2>Your team is fighting...</h2>
        <p>Please wait</p>
      </div>
    )
  }
}
