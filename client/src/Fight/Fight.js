import React from 'react';
import './Fight.scss';
import Battle from '../EditBot/GameResults/Battle';

export default class Fight extends React.Component {

  constructor(props) {
    super(props);

    const bot1Id = this.props.match.params.bot1;
    const bot2Id = this.props.match.params.bot2;

    this.state = {
      bot1Id,
      bot2Id,
      bots: [{}, {}],
      fights: [{}, {}],
      choice: null
    };

  }

  componentDidMount() {

    // const HOST = window.location.protocol + '//' + window.location.hostname + ':5000';
    const HOST = `${window.location.protocol}//${ window.location.hostname}/api`

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
      <div className="row full-height ">
        <div className="col-sm-12 fight-container">

          <div className=" section-title text-center">
            <h1>
              {this.state.bots[0].name}
              <small className="vs">vs</small>
              {this.state.bots[1].name}
            </h1>
          </div>



            <h2 className="text-center">Choose a round</h2>

            <div className="fight-splitter">

              <div>
                <h3 className="text-center">ROUND 1</h3>
                {
                  this.state.fights[0].history &&
                  <Battle results={JSON.parse(this.state.fights[0].history)} />
                }


              </div>


              <div>
                <h3 className="text-center">ROUND 2</h3>
                {
                  this.state.fights[1].history &&
                  <Battle results={JSON.parse(this.state.fights[1].history)} />
                }


              </div>

            </div>



        </div>


      </div>
    )

  }

}
