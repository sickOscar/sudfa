import React, {Component} from 'react';
import './GameResults.scss';
import Battle from "./Battle";

export class GameResults extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props,
      starting: false
    }
  }



  render() {
    return (
      <div className="game-results-container">

        {!this.props.results && <div className="text-center pristine">
          <h3>Start a fight!</h3>
        </div>}

        {this.props.error && <div className="error">ERROR {this.props.error}</div>}

        {this.props.results && <Battle className="battle" results={this.props.results}/>

        }
      </div>
    )
  }

}
