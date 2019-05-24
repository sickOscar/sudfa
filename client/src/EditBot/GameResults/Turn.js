import React from 'react';
import './Turn.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import dev_icon from '../../images/dev_icon.jpeg';
import pm_icon from '../../images/pm_icon.jpeg';
import mktg_icon from '../../images/mktg_icon.jpeg';

const Turn = (props) => {

  const {turn: propsTurn} = props;
  const {turn, team, state: status, index, players} = propsTurn;

  const icons = {
    'dev': dev_icon,
    'pm': pm_icon,
    'mktg': mktg_icon
  };

  const getIcon = (turn) => {

    if (turn.error) {
      return <FontAwesomeIcon icon="times"/>;
    }

    switch (turn.type) {
      case 'hit':
        return <FontAwesomeIcon icon="khanda"/>;
      case 'heal':
        return <FontAwesomeIcon icon="hospital-symbol"/>;
      case 'cast':
        return <FontAwesomeIcon icon="bolt"/>;
      case 'silence':
        return <FontAwesomeIcon icon="comment-slash"/>;
      case 'blind':
        return <FontAwesomeIcon icon="eye-slash"/>;
      default:
        return <FontAwesomeIcon icon="question"/>;
    }
  };

  const getTextClass = (turn) => {
    switch (turn.type) {
      case 'hit':
        return 'attack-text';
      case 'heal':
        return 'heal-text';
      case 'cast':
        return 'cast-text';
      case 'silence':
        return 'silence-text';
      case 'blind':
        return 'blind-text';
      default:
        return '';
    }
  };

  const getSoldierClassName = (soldierId, turn, soldierStatus, type) => {
    let className = [soldierId, 'soldier'];

    className.push(type);

    if (soldierId === turn.actor) {
      className.push('actor');
    }

    // ACTION TYPE
    if (turn.type === 'hit' && turn.success) {
      if (soldierId === turn.target) {
        className.push('target');
      }
    }
    if (turn.type === 'heal' && turn.success) {
      if (soldierId === turn.target) {
        className.push('healed');
      }
    }
    if (turn.type === 'cast' && turn.success) {
      if (!actorOfSameTeam(soldierId, turn)) {
        className.push('target');
      }
    }
    if (turn.type === 'silence' && turn.success) {
      if (soldierId === turn.target) {
        className.push('target');
      }
    }
    if (turn.type === 'blind' && turn.success) {
      if (soldierId === turn.target) {
        className.push('target');
      }
    }

    // SOLDIER STATUS
    if (soldierStatus.includes('SILENCED')) {
      className.push('silenced')
    }

    // SOLDIER STATUS
    if (soldierStatus.includes('BLIND')) {
      className.push('blind')
    }

    if (isDead(soldierId)) {
      className.push('dead');
    }

    return className.join(' ');
  };

  const isDead = soldierId => {
    return (
      status.teams[0][soldierId]
      || status.teams[1][soldierId]
    ).health <= 0;
  };

  const actorOfSameTeam = (soldierId) => {
    return team.troop.find(soldier => soldier.id === soldierId)
  };

  const getSoldierName = soldierId => {
    const team = players.find(player => {
      return player.troop.find(soldier => soldier.id === soldierId)
    });

    return team.troop.find(soldier => soldier.id === soldierId).name;
  };

  const getSoldierType = soldierId => {
    const team = players.find(player => {
      return player.troop.find(soldier => soldier.id === soldierId)
    });

    return team.troop.find(soldier => soldier.id === soldierId).type;
  };

  return (
    <div className="turn">

      <p className="player-name">{index + 1} - {team.name}</p>

      <div className="turn-base">

        <div className="icon-container">
          {getIcon(turn)}
        </div>

        <div className="text-container">

          {turn.error && <div>ERROR {turn.error}</div>}

          {!turn.error &&
          (
            <React.Fragment>
              <p className="action-text">

            <span className={getTextClass(turn)}>
            {turn.message}
            </span>

                {turn.tells && turn.tells.map((message, i) => {
                  return (
                    <React.Fragment key={i}>
                      <br/>
                      <small>{typeof message === 'string' ? message : JSON.stringify(message)}</small>
                    </React.Fragment>
                  )
                })}

              </p>


              {status.teams.map((team, i) => {
                return (
                  <div key={i} className="team-container">

                    {i === 0 && <h4>{players[i].name}</h4>}

                    <div className="soldier-box-container">
                      {
                        Object.keys(team).map(soldierId => {
                          return (
                            <div className={`soldier-box ${getSoldierClassName(soldierId, turn, team[soldierId].status, getSoldierType(soldierId))}`}>

                              {i === 0 && <div className="soldier-status">
                                {getSoldierName(soldierId)}
                                <small>({team[soldierId].health} HP)</small>
                              </div>}

                              <div className={getSoldierClassName(soldierId, turn, team[soldierId].status, getSoldierType(soldierId))}
                                style={{backgroundImage: `url(${icons[getSoldierType(soldierId)]})`}}/>

                              {i === 1 && <div className="soldier-status">
                                {getSoldierName(soldierId)}
                                <small>({team[soldierId].health} HP)</small>
                              </div>}
                            </div>
                          )
                        })
                      }
                    </div>

                    {i === 1 && <h4>{players[i].name}</h4>}
                  </div>
                )
              })}

            </React.Fragment>
          )
          }

        </div>

      </div>
    </div>
  );
}

export default Turn;
