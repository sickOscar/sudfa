import React from'react';
import {Header, Heading, Project, Button} from "arwes";
import dev_icon from "../images/dev_icon.jpeg";
import pm_icon from "../images/pm_icon.jpeg";
import mktg_icon from "../images/mktg_icon.jpeg";
import hr_icon from "../images/hr_icon.jpeg";
import {Link, withRouter} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const icons = {
  'dev': dev_icon,
  'pm': pm_icon,
  'mktg': mktg_icon,
  'hr': hr_icon
};

export const MainLeagueBots = withRouter(props => (
  <React.Fragment>

    <Header animate className="mb-2">
      <Heading node="h3">Main League Bots</Heading>
    </Header>

    {props.bots.map(bot => {
      const link = `edit/${bot.botid}`;
      return (
        <Project animate header={bot.name} key={bot.botid} className="mb-3">
          <div className="row">
            <div className="col-sm-6 icon-box">
              {bot.team && bot.team.map((soldier, i) => {
                return (
                  <img key={i} src={icons[soldier]} alt={soldier}/>
                )
              })}
            </div>
            <div className="col-sm-6 text-center py-5">
              <Button animate onClick={() => props.history.push(link)}>
                Edit team
              </Button>
            </div>
          </div>
        </Project>
      )
    })}

    {props.bots.length < 3 &&
      <Project animate header="Add New Bot" className="mb-3">
        <div className="row">
          <div className="col-sm-6 icon-box">
            <Link to={props.newBotLink}>
              <FontAwesomeIcon icon="plus-square"/>
            </Link>
          </div>
          <div className="col-sm-6 text-center py-5">
            <Button animate onClick={() => props.history.push(props.newBotLink)}>
              Create new team
            </Button>
          </div>
        </div>
      </Project>
    }

  </React.Fragment>
))


