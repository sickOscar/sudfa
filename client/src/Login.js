import React from 'react';
import {Redirect} from 'react-router-dom';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth
        };
    }

    login() {
        this.props.auth.login()
    }

    render() {

        console.log('AUTH', this.props.auth.isAuthenticated())

        if (this.props.auth.isAuthenticated()) {
            return <Redirect to="bots" />
        }

        return (
            <div>
                <button onClick={this.login.bind(this)}>Login</button>  
            </div>
        )
    }

}
