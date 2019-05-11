import React, { Component } from 'react';

export class GameResults extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <div>
                    <button onClick={this.props.onTestCode} >Test Code</button>
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