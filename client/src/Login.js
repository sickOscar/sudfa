import React from 'react';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    login() {
        this.props.auth.login()
    }

    render() {
        return (
            <div>
                <button onClick={this.login.bind(this)}>Login</button>  
            </div>
        )
    }

}