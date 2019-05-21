import React from 'react';
import './Profile.scss';

export default class Profile extends React.Component {

  constructor(props) {
    super(props);

    const user = JSON.parse(localStorage.getItem('user'));

    this.state = {
      name: user.name || ''
    };

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
    });

    return (
      <div className="profile-container">
        <div className="row text-center">
          <div className="col-md-12 section-title">
            <h1>Welcome!</h1>
          </div>

          <div className="col-sm-12">

            <h4>You are almost ready to begin your journey to fame and glory.</h4>

            <p>Please choose a name (you can update it later)</p>

          </div>


          <div className="input-group col-md-4 offset-md-4">
              <input className="form-control form-control-lg name-input"
                     type="text"
                     maxLength={30}
                     value={this.state.name}
                     placeholder="Not a bot name"
                     onChange={this.handleNameChange}/>

          </div>

          <div className="col-sm-12 mt-4">
            <button className="btn btn-primary btn-lg"
                    onClick={saveProfile}
                    disabled={!this.state.name || !(this.state.name.trim().length > 3) }>
              Save
            </button>
          </div>
        </div>
      </div>
    )
  }

}
