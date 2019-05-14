import React, { Component } from 'react';

export class GameResults extends Component {

    constructor(props) {
        super(props)
        this.state = {}

        this.levels = [
            {
                value: 'junior',
                label: 'Junior'
            },
            {
                value: 'mid-level',
                label: 'Mid-Level'
            },
            {
                value: 'senior',
                label: 'Senior'
            },
            {
                value: 'guru',
                label: 'Guru'
            }
        ]
    }

    getSoldierTeam(soldierId) {
      return this.props.results.players.find(player => {
        return player.troop.find(soldier => soldier.id === soldierId)
      }).name;
    }

    getSoldierName(soldierId) {
      const team = this.props.results.players.find(player => {
        return player.troop.find(soldier => soldier.id === soldierId)
      })

      return team.troop.find(soldier => soldier.id === soldierId).name;
    }

    render() {
        return (
            <div>
              {this.props.error ? <div className="error">ERROR {this.props.error}</div> : ''}
                <div>
                    <button onClick={this.props.onTestCode} >Test Code</button>
                    <select onChange={this.props.onLevelChange}>
                        {this.levels.map(level => {
                            return <option key={level.label} value={level.value}>{level.label}</option>
                        })}
                    </select>  
                    <button onClick={this.props.sendToLeague}>Send to league</button>
                </div>
                <div>
                  {this.props.results ? this.props.results.turns.map((turn, i) => {
                    return (
                      <div key={i}>
                        <p><b>{this.getSoldierTeam(turn.turn.actor)}'s turn</b></p>
                        <p>{turn.turn.message}</p>
                        { turn.turn.tells.length > 0 ? turn.turn.tells.map((message, i) => <p key={i}>{JSON.stringify(message)}</p>) : '' }

                        { turn.state.teams.map((team, i) => {
                          return (
                            <p key={i}> {this.props.results.players[i].name} => {
                              Object.keys(team).map(soldierId => {
                                return <span key={soldierId}>{this.getSoldierName(soldierId)}: {team[soldierId].health} |</span>
                              })
                            }
                            </p>
                          )
                        }) }
                        <hr/>
                      </div>
                    )
                  }) : ''}

                  <h4>Fight end!</h4>

                  {this.props.results ? <div>
                    <p><b>The winner is {this.props.results.exit.winner}</b></p>
                  </div> : ''}

                    <pre>
                        {JSON.stringify(this.props.results, null, 2)}
                    </pre>
                </div>
            </div>
        )
    }

}
