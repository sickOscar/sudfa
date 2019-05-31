import React from 'react';
import Popover from "react-bootstrap/Popover";
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Env from '../env';

export default class MyBotsFights extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      fights: {}
    }
  }

  componentDidMount() {

    fetch(`${Env.API_HOST}/fights?bots=${this.props.mybots.map(b => b.botid).join(',')}&against=${this.props.botid}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(fights => {
        this.setState({
          fights: this.props.mybots.reduce((final, mybotObj) => {
            const mybot = mybotObj.botid;
            const involved = fights.filter(f => (f.bot1 === mybot || f.bot2 === mybot));

            final[mybot] = {
              w: involved.filter(i => i.winner === mybot && i.by === 'WIN').length,
              t: involved.filter(i => i.winner === mybot && i.by === 'TIE').length,
              l: involved.filter(i => i.winner !== mybot).length,
            }

            return final;

          }, {})

        })
      })
      .catch(err => console.error(err))


    const popoverPlacement = document.getElementById(this.props.botid + '-popover-placement');
    var rect = popoverPlacement.getBoundingClientRect();
    const scrollTop = window.pageYOffset;


    console.log("rect", rect, scrollTop);

    this.setState({
      top: rect.top + scrollTop,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left
    })

  }

  render() {
    return <Popover title="Fights with your bots"
                    style={{left: this.state.left + 30, top: this.state.top, width: '300px', maxWidth: '300px'}}>

      <table className="table">
        <thead>
          <tr>
            <th>Bot</th>
            <th>W</th>
            <th>T</th>
            <th>L</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {this.props.mybots.map((mybot, i) => {
          return (
            <tr key={i}>
              <td>{mybot.name}</td>
              <td>{this.state.fights[mybot.botid] && this.state.fights[mybot.botid].w}</td>
              <td>{this.state.fights[mybot.botid] && this.state.fights[mybot.botid].t}</td>
              <td>{this.state.fights[mybot.botid] && this.state.fights[mybot.botid].l}</td>
              <td>
                <Link to={`/fight/${mybot.botid}/${this.props.botid}`}>
                  <FontAwesomeIcon icon="eye" />
                </Link>
              </td>
            </tr>)
        })}
        </tbody>
      </table>

    </Popover>
  }

}
