import React from 'react';
import {Link} from 'react-router-dom'
import './Bots.scss';
import Env from '../env';

import dev_icon from '../images/dev_icon.jpeg';
import pm_icon from '../images/pm_icon.jpeg';
import mktg_icon from '../images/mktg_icon.jpeg';
import hr_icon from '../images/hr_icon.jpeg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Bots extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: this.props.auth.getUser(),
      bots: [],
      addingGroup: false,
      groups: [],
      groupName: '',
      joinGroup: ''
    };

    this.icons = {
      'dev': dev_icon,
      'pm': pm_icon,
      'mktg': mktg_icon,
      'hr': hr_icon
    };

    this.toggleAddGroup = this.toggleAddGroup.bind(this);
    this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
    this.submitAddGroupForm = this.submitAddGroupForm.bind(this);
    this.handleJoinGroupChange = this.handleJoinGroupChange.bind(this);
    this.submitJoinGroupForm = this.submitJoinGroupForm.bind(this);

  }

  componentDidMount() {
    this.getBots();
    this.getGroups();
  }

  getBots() {
    fetch(`${Env.API_HOST}/mybots`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      }
    })
      .then(response => response.json())
      .then(results => {
        this.setState({bots: results})
      })
      .catch(err => console.error(err))
  }

  getGroups() {
    fetch(`${Env.API_HOST}/mygroups`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      }
    })
      .then(response => response.json())
      .then(results => {
        this.setState({groups: results})
      })
      .catch(err => console.error(err))
  }

  toggleAddGroup() {
    this.setState({
      addingGroup: !this.state.addingGroup
    })
  }

  handleGroupNameChange(event) {
    this.setState({
      groupName: event.target.value
    })
  }

  handleJoinGroupChange(event) {
    this.setState({
      joinGroup: event.target.value
    })
  }

  submitAddGroupForm(event) {
    event.preventDefault();
    fetch(`${Env.API_HOST}/groups`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      },
      body: JSON.stringify({
        name: this.state.groupName,
        is_public: true
      })
    })
      .then(response => response.json())
      .then(results => {
        this.getGroups();
      })
      .catch(err => console.error(err))
  }

  submitJoinGroupForm(event) {
    event.preventDefault();
    fetch(`${Env.API_HOST}/groups/user-join`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      },
      body: JSON.stringify({
        name: this.state.joinGroup
      })
    })
      .then(response => response.json())
      .then(results => {
        this.getGroups();
      })
      .catch(err => console.error(err))
  }

  botSubmitted(group) {
    return group.bots.find(bot => bot.user === this.state.user.id)
  }

  addBotToGroup(groupId) {
    console.log("add bot to group", groupId);
  }

  render() {

    const newBotId = window.encodeURIComponent(this.state.user.name) + '_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const newBotLink = `edit/${newBotId}`;

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-sm-12 text-center section-title">
            <h1>{this.state.user ? this.state.user.name : ''}'s teams</h1>
          </div>
        </div>

        <div className="row">

          {this.state.bots.map(bot => {
            const link = `edit/${bot.botid}`;
            return (
              <div className="col-sm-4" key={bot.botid}>
                <div className="card bot-card">
                  <div className="card-body">
                    <h5 className="card-title">{bot.name}</h5>
                    <div className="icon-box">
                      {bot.team && bot.team.map((soldier, i) => {
                        return (
                          <img key={i} src={this.icons[soldier]} alt={soldier}/>
                        )
                      })}
                    </div>
                    <Link to={link} className="btn btn-primary">
                      Edit team
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}

          {this.state.bots.length < 3 && <div className="col-sm-4">
            <div className="card bot-card">
              <div className="card-body">
                <h5 className="card-title">New Bot</h5>
                <div className="icon-box">
                  <Link to={newBotLink}>
                    <FontAwesomeIcon icon="plus-square"/>
                  </Link>
                </div>
                <Link to={newBotLink} className="btn btn-primary">
                  Create new team
                </Link>
              </div>
            </div>
          </div>
          }

        </div>

        <div className="row">
          <div className="col-sm-12 text-center section-title">
            <h1>{this.state.user ? this.state.user.name : ''}'s groups</h1>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 text center">
            <button onClick={this.toggleAddGroup}>New Group</button>
          </div>
        </div>

        <div className="row">
          <form className="col-sm-6" onSubmit={this.submitAddGroupForm}>
            <div className="form-group">
              <label htmlFor="name">Group Name</label>
              <input className="form-control" type="text"
                     onChange={this.handleGroupNameChange}
                     value={this.state.groupName}/>

              <button type="submit">Add Group</button>
            </div>
          </form>

          <form className="col-sm-6" onSubmit={this.submitJoinGroupForm}>
            <div className="form-group">
              <label htmlFor="name">Group Name</label>
              <input className="form-control" type="text"
                     onChange={this.handleJoinGroupChange}
                     value={this.state.joinGroup}/>

              <button type="submit">Join Group</button>
            </div>
          </form>

        </div>

        <div className="row">

            {this.state.groups.map((group, i) => {
              const userBotForThisGroup = this.botSubmitted(group);
              return (
                <div className="group-container col-sm-12 col-md-6" key={i}>
                  <div className="card">
                    <div className="card-body">
                      <h3 className="text-center">
                        {group.name}
                      </h3>
                      <p className="text-center">{group.players} players</p>

                      <div className="group-bot-container">
                        {!userBotForThisGroup
                          ? (
                            <Link to={`edit-group/${newBotId}/${group.id}`}
                                  className="btn btn-primary">
                              Join this fight!
                            </Link>
                          )
                          :
                          (
                            <div className="bot-card">
                              <h5 className="card-title">{userBotForThisGroup.name}</h5>
                              <div className="icon-box">
                                {userBotForThisGroup.team && userBotForThisGroup.team.map((soldier, i) => {
                                  return (
                                    <img key={i} src={this.icons[soldier]} alt={soldier}/>
                                  )
                                })}
                              </div>

                              <Link to={`edit-group/${userBotForThisGroup.botid}/${group.id}`}
                                    className="btn btn-primary">
                                Edit this bot
                              </Link>
                            </div>

                          )}
                      </div>

                      <div className="group-leaderboard-container">
                        {group.leaderboard.length === 0
                          ? <div>Still no leaderboard :-(</div>
                          : <div>{group.leaderboard}</div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

        </div>


      </React.Fragment>
    )

  }

}
