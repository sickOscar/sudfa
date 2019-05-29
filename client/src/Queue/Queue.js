import React from 'react';
import env from '../env';
import './Queue.scss';
import history from "../history";

export default class Queue extends React.Component {

  constructor(props) {
    super(props);
    this.interval = 0;

    this.state = {
      showOverlay: false
    }
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

          if (results.exit === 'KO') {
            this.setState({
              showOverlay: true
            })
          }

          console.log('wait...');
        }

      })
      .catch(err => {
        console.error(err);
      })

  }

  closeOverlay() {
    this.setState({
      showOverlay: false
    })
    history.replace(`/edit/${this.props.match.params.botid}`)
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

        {this.state.showOverlay && (
          <div className="overlay">
            <div className="overlay-content">
              <h3>Ok, let's face it,</h3>
              <h2>Something went terribly wrong</h2>
              <p>Maybe your code has errors, maybe our code has errors. Who knows?</p>

              <p>Maybe this is all a nightmare and you will soon wake up all greasy and sweaty.</p>

              <p>Only time will tell us</p>

              <p><b>PS: Are you really sure your code is correct? Just saying...</b></p>

              <button onClick={this.closeOverlay.bind(this)} className="btn btn-primary">
                Back to editing
              </button>
            </div>
          </div>
        )}

        <div className="loader"></div>
        <h2>Your team is fighting...</h2>
        <p>Please wait</p>
      </div>
    )
  }
}
