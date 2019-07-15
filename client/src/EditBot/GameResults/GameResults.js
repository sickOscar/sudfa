import React, {Component} from 'react';
import './GameResults.scss';
import Battle from "./Battle";
import Joyride from 'react-joyride';

export class GameResults extends Component {

  constructor(props) {
    super(props);
    this.state = {
      starting: false,
      resultsJoyride : {
        showProgress: true,
        // debug: true,
        continuous: true,
        run: false,
        steps: [
          {
            target: '.game-results-container',
            content: "In this box you'll see the progression of the battle",
            placement: "top"
          },
          {
            target: '.actions-container',
            content: "Here you can pause the progress, go step-by-step, fast forward the match o reset from the beginning",
            placement: "top"
          },
          {
            target: '.turns-container',
            content: "Every turn will show an icon for the type of action done, a simple description of the action and  the battlefield status after the action specified is completed",
            placement: "top"
          }
        ]
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.results && !nextState.resultsJoyride.run) {

      const j = localStorage.getItem('resultsJoyrideDone');
      if (!j || j === "false") {
        this.setState({
          resultsJoyride: {
            ...this.state.resultsJoyride,
            run: true
          }
        })
      }

    }
    return true;
  }

  checkResultsJoyride(state) {
    if (state.action === 'reset') {
      localStorage.setItem('resultsJoyrideDone', 'true');
    }
  }

  render() {
    return (

      <React.Fragment>

          <Joyride
            {...this.state.resultsJoyride}
            callback={this.checkResultsJoyride.bind(this)}
          />


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
      </React.Fragment>
    )
  }

}
