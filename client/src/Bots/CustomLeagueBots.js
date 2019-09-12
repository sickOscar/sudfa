import React from 'react';
import {Header, Heading, Button, Project, Words, Frame} from "arwes";
import dev_icon from "../images/dev_icon.jpeg";
import pm_icon from "../images/pm_icon.jpeg";
import mktg_icon from "../images/mktg_icon.jpeg";
import hr_icon from "../images/hr_icon.jpeg";
import {withRouter} from "react-router-dom";
import Leaderboard from '../Leaderboard/Leaderboard';

const icons = {
  'dev': dev_icon,
  'pm': pm_icon,
  'mktg': mktg_icon,
  'hr': hr_icon
};

export const CustomLeagueBots = withRouter(({group, user, bot, newBotId, auth, deleteGroup, ...props}) => (
  <React.Fragment>

    <Header animate className="mb-2">
      <Heading node="h3">{group.name} - League status</Heading>
    </Header>

    {user.id === group.owner && (
      <Frame className="my-3">
        <div className="d-flex p-4">
          <div style={{'flex': 1}}>
            <p>You are the owner of this league</p>
          </div>
          <div style={{'flex': 1}} className="text-center">
            <Button layer="alert" animate onClick={deleteGroup}>
              Delete League
            </Button>
          </div>
        </div>
      </Frame>
    )}

    {!bot
      ? (
        <div className="py-5 text-center">
          <Button onClick={() => props.history.push(`/edit-group/${newBotId}/${group.id}`)}>
            Join this fight!
          </Button>
        </div>
      )
      :
      (
        <Project animate header={bot.name} className="mb-3">
          <div className="row">
            <div className="col-sm-6 icon-box">
              {bot.team && bot.team.map((soldier, i) => {
                return (
                  <img key={i} src={icons[soldier]} alt={soldier}/>
                )
              })}
            </div>
            <div className="col-sm-6 text-center py-5">
              <Button animate onClick={() => props.history.push(`edit-group/${bot.botid}/${group.id}`)}>
                Edit team
              </Button>
            </div>
          </div>
        </Project>

      )}

    <Header animate className="mb-2">
      <Heading node="h3">{group.name} leaderboard</Heading>
    </Header>

    {
      group.leaderboard.length === 0 ?
        <Words animate>Still no fights in this league!</Words>
        :
        <Leaderboard auth={auth} board={group.leaderboard} />
    }


  </React.Fragment>
))


// {/*<Frame show animate key={i} level={3} corners={4} layer='primary'>*/}
//
// {/*      <h3 className="text-center">*/}
// {/*        {group.name}*/}
// {/*      </h3>*/}
// {/*      <p className="text-center">{group.players} players</p>*/}
//
// {/*      <div className="group-bot-container">*/}
// {/*        {!userBotForThisGroup*/}
// {/*          ? (*/}
// {/*            <Link to={`edit-group/${newBotId}/${group.id}`}*/}
// {/*                  className="btn btn-primary">*/}
// {/*              Join this fight!*/}
// {/*            </Link>*/}
// {/*          )*/}
// {/*          :*/}
// {/*          (*/}
// {/*            <div className="bot-card">*/}
// {/*              <h5 className="card-title">{userBotForThisGroup.name}</h5>*/}
// {/*              <div className="icon-box">*/}
// {/*                {userBotForThisGroup.team && userBotForThisGroup.team.map((soldier, i) => {*/}
// {/*                  return (*/}
// {/*                    <img key={i} src={this.icons[soldier]} alt={soldier}/>*/}
// {/*                  )*/}
// {/*                })}*/}
// {/*              </div>*/}
//
// {/*              <CustomLink to={`edit-group/${userBotForThisGroup.botid}/${group.id}`}*/}
// {/*                          className="btn btn-primary">*/}
// {/*                Edit this bot*/}
// {/*              </CustomLink>*/}
// {/*            </div>*/}
//
// {/*          )}*/}
// {/*      </div>*/}
//
// {/*      <div className="group-leaderboard-container">*/}
// {/*        {group.leaderboard.length === 0*/}
// {/*          ? <div>Still no leaderboard :-(</div>*/}
// {/*          : <div>{JSON.stringify(group.leaderboard)}</div>*/}
// {/*        }*/}
// {/*      </div>*/}
//
// {/*</Frame>*/}
