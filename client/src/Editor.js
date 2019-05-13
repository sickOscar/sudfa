import React, { Component } from 'react';
// import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/java';
import 'brace/theme/solarized_dark';



export class Editor extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            
                <AceEditor
                    width="100%"
                    height="100%"
                    value={this.props.code}
                    mode="javascript"
                    theme="solarized_dark"
                    onChange={this.props.onChange}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{$blockScrolling: true}}
                />
            
        )
    }

}