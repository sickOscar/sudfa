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

    render() {
        return (
            <div>
                <div>
                    <button onClick={this.props.onTestCode} >Test Code</button>
                    <select onChange={this.props.onLevelChange}>
                        {this.levels.map(level => {
                            return <option key={level.label} value={level.value}>{level.label}</option>
                        })}
                    </select>  
                    <button onClick={this.props.sendToLeague}>Send to league</button>
                </div>
                <div style={{maxHeight: '300px', overflow:'scroll'}}>
                    <pre>
                        {JSON.stringify(this.props.results, null, 2)}
                    </pre>
                </div>
            </div>
        )
    }

}