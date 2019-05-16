import React from 'react';

export default class Profile extends React.Component {

  constructor(props) {
    super(props);

    const user = JSON.parse(localStorage.getItem('user'))

    this.state = {
      name: user.name
    }

    this.handleNameChange = this.handleNameChange.bind(this)

  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value
    })
  }

  render() {

    const saveProfile = this.props.auth.saveProfile.bind(this.props.auth, {
      name : this.state.name
    })

    return (
      <div>
        <h3>Welcome!</h3>

        <p>Please update your profile</p>

        <div>
          <label htmlFor="name">
            Nickname
            <input type="text" value={this.state.name} onChange={this.handleNameChange}/>
          </label>
        </div>

        <div>
          <button onClick={saveProfile} disabled={!(this.state.name.trim())}>
            Save
          </button>
        </div>
      </div>
    )
  }

}
