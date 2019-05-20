import React, {Component} from 'react';
import './GameResults.scss';
import Battle from "./Battle";

export class GameResults extends Component {

  constructor(props) {
    super(props);
    this.state = {
      starting: false
    }
  }



  render() {
    return (
      <div className="game-results-container">

        {!this.props.results && !this.props.error && <div className="text-center pristine">
          <h3>Start a fight!</h3>
        </div>}

        {this.props.error && <div className="text-center error">
          <p><b>There is an error in your source code</b><br/>
          {this.props.error}</p>
        </div>
        }

        {this.props.results && !this.props.error && <Battle className="battle" results={this.props.results}/>

        }
      </div>
    )
  }

}
