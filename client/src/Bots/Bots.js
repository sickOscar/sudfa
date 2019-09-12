import React from 'react';
import './Bots.scss';
import Env from '../env';

import dev_icon from '../images/dev_icon.jpeg';
import pm_icon from '../images/pm_icon.jpeg';
import mktg_icon from '../images/mktg_icon.jpeg';
import hr_icon from '../images/hr_icon.jpeg';

import {Frame, Button, Header, Heading} from "arwes";
import {MainLeagueBots} from "./MainLeagueBots";
import {CustomLeagueBots} from "./CustomLeagueBots";

export default class Bots extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: this.props.auth.getUser(),
      bots: [],
      addingGroup: false,
      groups: [],
      groupName: '',
      joinGroup: '',
      openLeague: 'main',
      createGroupError: null,
      joinGroupError: null
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
    this.openGroup = this.openGroup.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);

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
    this.setState({
      createGroupError: null
    })
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
      .then(response => {
        if (!response.ok) {
          response.json().then((err) => {
            this.setState({
              createGroupError: err.message
            })
          })
        } else {
          response.json().then(() => {
            this.getGroups();
          })
        }
      })

  }

  submitJoinGroupForm(event) {
    event.preventDefault();
    this.setState({
      joinGroupError: null
    })
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
      .then(response => {
        if (!response.ok) {
          response.json().then((err) => {
            this.setState({
              joinGroupError: err.message
            })
          })
        } else {
          response.json().then(() => {
            this.getGroups();
          })
        }
      })
  }

  botSubmitted(group) {
    return group.bots.find(bot => bot.user === this.state.user.id)
  }

  addBotToGroup(groupId) {
    console.log("add bot to group", groupId);
  }

  openGroup(groupId) {
    this.setState({
      openLeague: groupId
    })
  }

  deleteGroup(groupId) {
    fetch(`${Env.API_HOST}/groups/${groupId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.auth.getToken()}`
      }
    })
      .then(response => response.json())
      .then(results => {
        this.setState({
          groups: this.state.groups.filter(g => g.id !== groupId),
          openLeague: 'main'
        })
      })
      .catch(err => console.error(err))
  }

  renderCustomLeagueBots() {
    if ((this.state.openLeague !== 'main')) {
      const currentGroup = this.state.groups.find(g => g.id === this.state.openLeague)
      const userBotForThisGroup = this.botSubmitted(currentGroup);
      const newBotId = window.encodeURIComponent(this.state.user.id) + '_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
      return ((
        <CustomLeagueBots group={currentGroup}
                          user={this.state.user}
                          bot={userBotForThisGroup}
                          auth={this.props.auth}
                          deleteGroup={() => this.deleteGroup(currentGroup.id)}
                          newBotId={newBotId}/>
      ))
    }
    return null;
  }

  render() {

    const newBotId = window.encodeURIComponent(this.state.user.id) + '_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const newBotLink = `edit/${newBotId}`;

    return (
      <React.Fragment>

        <div className="row">

          <div className="col-sm-8">
            <Frame
              show
              animate
              level={3}
              corners={4}
              layer='primary'
              className="p-3"
            >
              {this.state.openLeague === 'main' && <MainLeagueBots bots={this.state.bots} newBotLink={newBotLink}/>}
              {this.renderCustomLeagueBots()}
            </Frame>
          </div>

          <div className="col-sm-4">
            <Frame show animate level={3} corners={4} layer='primary' className="p-3">

              <Header animate className="mb-2">
                <Heading node="h3">Leagues</Heading>
              </Header>

              <Frame className={`mb-2 league-button ${this.state.openLeague === 'main' && 'active'}`}
                     onClick={() => this.openGroup('main')}
                      layer={this.state.openLeague === 'main' ? 'secondary' : 'primary'}
              >
                <Header animate>
                  <Heading node="h4">Main League</Heading>
                </Header>
              </Frame>

              { this.state.groups.map((group, i) => {

                return (
                  <Frame className={`mb-2 league-button ${this.state.openLeague === group.id && 'active'}`}
                         onClick={() => this.openGroup(group.id)}
                         layer={this.state.openLeague === group.id ? 'secondary' : 'primary'}
                         key={i}>
                    <Header animate>
                      <Heading node="h4">{group.name}</Heading>
                    </Header>
                  </Frame>
                )
              })}

              {this.state.groups.length < 3 &&<Frame className="mb-2" show animate level={3} corners={4} layer='primary'>
                <form onSubmit={this.submitAddGroupForm}>
                  <div className="form-group">
                    <Header animate>
                      <Heading node="h4">Create a new league</Heading>
                    </Header>
                    <div className="row p-2">
                      <div className="col-sm-8">
                        <input className="form-control" type="text"
                               onChange={this.handleGroupNameChange}
                               placeholder="league name"
                               value={this.state.groupName}/>
                      </div>
                      <div className="col-sm-4">
                        <Button type="submit">Create</Button>
                      </div>
                    </div>
                    {this.state.createGroupError && (
                      <div>
                        <p>{this.state.createGroupError}</p>
                      </div>
                    )}

                  </div>
                </form>
              </Frame>}

              <Frame className="mb-2" show animate level={3} corners={4} layer='primary'>
                <form onSubmit={this.submitJoinGroupForm}>
                  <div className="form-group">
                    <Header animate>
                      <Heading node="h4">Join an existing league</Heading>
                    </Header>
                    <div className="row p-2">
                      <div className="col-sm-8">
                        <input className="form-control" type="text"
                               placeholder="league name"
                               onChange={this.handleJoinGroupChange}
                               value={this.state.joinGroup}/>
                      </div>
                      <div className="col-sm-4">
                        <Button type="submit">Join</Button>
                      </div>
                    </div>

                    {this.state.joinGroupError && (
                      <div>
                        <p>{this.state.joinGroupError}</p>
                      </div>
                    )}
                  </div>
                </form>
              </Frame>

            </Frame>

          </div>

        </div>

      </React.Fragment>
    )

  }

}
