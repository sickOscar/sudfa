import React from 'react';
import {Header, Heading, Button} from "arwes";
import {CustomLink} from "../CustomLink";
import dev_icon from "../images/dev_icon.jpeg";
import pm_icon from "../images/pm_icon.jpeg";
import mktg_icon from "../images/mktg_icon.jpeg";
import hr_icon from "../images/hr_icon.jpeg";
import {withRouter} from "react-router-dom";


const icons = {
  'dev': dev_icon,
  'pm': pm_icon,
  'mktg': mktg_icon,
  'hr': hr_icon
};

export const CustomLeagueBots = withRouter(({group, user, bot, newBotId, ...props}) => (
  <React.Fragment>

    <Header animate className="mb-2">
      <Heading node="h3">{group.name} status</Heading>
    </Header>

    {!props.bot
          ? (
            <div className="py-5 text-center">
              <Button onClick={() => props.history.push(`/edit-group/${newBotId}/${group.id}`)}>
                Join this fight!
              </Button>
            </div>
          )
          :
          (
            <div className="bot-card">
              <h5 className="card-title">{props.bot.name}</h5>
              <div className="icon-box">
                {props.bot.team && props.bot.team.map((soldier, i) => {
                  return (
                    <img key={i} src={icons[soldier]} alt={soldier}/>
                  )
                })}
              </div>

              <CustomLink to={`edit-group/${props.bot.botid}/${group.id}`}
                          className="btn btn-primary">
                Edit this bot
              </CustomLink>
            </div>

          )}


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
