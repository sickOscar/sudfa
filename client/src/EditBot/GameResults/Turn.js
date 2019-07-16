import React from 'react';
import './Turn.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import dev_icon from '../../images/dev_icon.jpeg';
import pm_icon from '../../images/pm_icon.jpeg';
import mktg_icon from '../../images/mktg_icon.jpeg';
import hr_icon from '../../images/hr_icon.png';

const Turn = (props) => {

  const {turn: propsTurn} = props;
  const {turn, team, state: status, index, players} = propsTurn;

  const icons = {
    'dev': dev_icon,
    'pm': pm_icon,
    'mktg': mktg_icon,
    'hr': hr_icon
  };

  const getIcon = (turn) => {

    if (turn.error) {
      return <FontAwesomeIcon icon="times"/>;
    }

    switch (turn.type) {
      case 'hit':
        return <FontAwesomeIcon icon="fist-raised"/>;
      case 'heal':
        return <FontAwesomeIcon icon="hospital-symbol"/>;
      case 'cast':
        return <FontAwesomeIcon icon="bolt"/>;
      case 'silence':
        return <FontAwesomeIcon icon="comment-slash"/>;
      case 'blind':
        return <FontAwesomeIcon icon="eye-slash"/>;
      case 'poison':
        return <FontAwesomeIcon icon="skull-crossbones"/>;
      case 'protect':
        return <FontAwesomeIcon icon="user-shield"/>;
      case 'ress':
        return <FontAwesomeIcon icon="cross"/>;
      case 'summon':
        return <FontAwesomeIcon icon="diagnoses"/>;
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
      case 'poison':
        return 'poison-text';
      case 'protect':
        return 'protect-text';
      case 'ress':
        return 'ress-text';
      case 'summon':
        return 'summon-text';
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
    if (turn.type === 'poison' && turn.success) {
      if (soldierId === turn.target) {
        className.push('target');
      }
    }
    if (turn.type === 'protect' && turn.success) {
      if (soldierId === turn.target) {
        className.push('target');
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
    if (turn.type === 'poison' && turn.success) {
      if (soldierId === turn.target) {
        className.push('target');
      }
    }
    if (turn.type === 'ress' && turn.success) {
      if (soldierId === turn.target) {
        className.push('target');
      }
    }

    if (turn.type === 'summon' && turn.success) {
      // if (soldierId === turn.target) {
      //   className.push('target');
      // }
    }


    // SOLDIER STATUS
    if (soldierStatus.includes('SILENCED')) {
      className.push('silenced')
    }

    // SOLDIER STATUS
    if (soldierStatus.includes('BLIND')) {
      className.push('blind')
    }

    // SOLDIER STATUS
    if (soldierStatus.includes('POISONED')) {
      className.push('poisoned')
    }

    // SOLDIER STATUS
    if (soldierStatus.includes('PROTECTED')) {
      className.push('protected')
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

      <p className="player-name">{team.name}</p>

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
                            <div key={soldierId} className={`soldier-box ${getSoldierClassName(soldierId, turn, team[soldierId].status, getSoldierType(soldierId))}`}>

                              {i === 0 && <div className="soldier-status">
                                {getSoldierName(soldierId)}
                                <small>
                                  ({team[soldierId].health} HP)
                                  {team[soldierId].healthDiff !== 0 && <span className={team[soldierId].healthDiff > 0 ? 'cure-text' : 'dmg-text'}>
                                    {team[soldierId].healthDiff < 0 ? ` ${team[soldierId].healthDiff} HP` : `+${team[soldierId].healthDiff} HP` }
                                  </span>
                                  }
                                </small>
                              </div>}

                              <div>
                                {i === 1 && <div className="totem-container">
                                  {team[soldierId].totems.map((totem, j) => (<div key={`${j}-${totem.type}`} className={"totem totem-" + totem.type} title={totem.type + ' totem'}></div>))}
                                </div>}
                                <div className={getSoldierClassName(soldierId, turn, team[soldierId].status, getSoldierType(soldierId))}
                                  style={{backgroundImage: `url(${icons[getSoldierType(soldierId)]})`}}/>
                                {i === 0 && <div className="totem-container">
                                  {team[soldierId].totems.map((totem, j) => (<div  key={`${j}-${totem.type}`} className={"totem totem-" + totem.type} title={totem.type + ' totem'}></div>))}
                                </div>}
                              </div>

                              {i === 1 && <div className="soldier-status">
                                {getSoldierName(soldierId)}
                                <small>
                                  ({team[soldierId].health} HP)
                                  {team[soldierId].healthDiff !== 0 && <span className={team[soldierId].healthDiff > 0 ? 'cure-text' : 'dmg-text'}>
                                    {team[soldierId].healthDiff < 0 ? ` ${team[soldierId].healthDiff} HP` : `+${team[soldierId].healthDiff} HP` }
                                  </span>}
                                </small>
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
