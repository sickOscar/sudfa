function Soldier(game, options) {

  const id = Math.random().toString(36).substring(2);
  const type = options.type;
  const name = options.name || options.type;
  const motto = options.motto || "Random quote";

  let health = 0;
  let attack = 0;
  let magicPower = 0;
  let maxHealth = 0;
  let status = ['OK'];
  let healPower = 0;

  let tells = [];

  switch (options.type) {
    case 'dev':
      health = maxHealth = 12 * 2;
      attack = 3;
      break;
    case 'pm':
      health = maxHealth = 10 * 2;
      attack = 2;
      healPower = 5;
      break;
    case 'mktg':
      health = maxHealth = 7 * 2;
      attack = 1;
      // healPower = 1;
      magicPower = 2;
      break;
    default:
      throw new Error('Invalid soldier type')
  }

  const hit = (target) => {
    doAction.call(this, 'hit', target)
  };

  const heal = (target) => {
    doAction.call(this, 'heal', target)
  };

  const cast = () => {
    doAction.call(this, 'cast')
  };

  const silence = (target) => {
    doAction.call(this, 'silence', target)
  }

  const blind = (target) => {
    doAction.call(this, 'blind', target)
  }

  const canHit = (target) => {
    return !status.includes('BLIND');
  }

  const canHeal = () => {
    return type === 'pm' && !status.includes('SILENCED');
  };

  const canCast = () => {
    return type === 'mktg' && !status.includes('SILENCED');
  };

  const canSilence = () => {
    return type === 'pm' && !status.includes('SILENCED');
  }

  const canBlind = () => {
    return type === 'pm' && !status.includes('SILENCED');
  }

  const say = (message) => {
    if (tells.length < 10) {
      if (message === undefined || message === null) {
        tells.push('undefined')
      } else if (typeof message === "string") {
        tells.push(message.substring(0, 100));
      } else {
        tells.push(JSON.stringify(message).substring(0, 100))
      }
    }

  };


  const doAction = (actionType, target) => {

    let success = false;
    let message = '';

    if (game.currentPlayer.actionDone) {
      throw new Error('You can do only one action per turn');
    }


    // HIT
    if (actionType === 'hit') {
      if (canHit()) {
        if (target) {
          const aliveOpponents = game.getAliveTroops(game.opponentPlayer.team);
          const t = aliveOpponents.find(soldier => soldier.getId() === target.getId());


          t.setHealth(t.getHealth() - attack);

          message = `${name} attacks ${t.getName()} - ${attack} damage`;
          success = true;
        } else {
          message = `${name} fails to attack - no target`;
          success = false;
        }
      } else {
        message = `${name} can't attack, sorry! You lost an action!`;
        success = false;
      }
    }

    // HEAL
    if (actionType === 'heal') {
      if (canHeal()) {

        if (target) {
          const aliveCompanions = game.getAliveTroops(game.currentPlayer.team);
          const t = aliveCompanions.find(soldier => soldier.getId() === target.getId());

          if (!t) {
            message = `${name} trying to heal: invalid target`;
            success = false;
          } else {
            message = `${name} heals companion ${t.getName()}`;
            t.setHealth(Math.min(maxHealth, t.getHealth() + healPower))
            success = true;
          }
        } else {
          message = `${name} can't heal - no target`;
          success = false;
        }


      } else {
        message = `${name} can't heal, sorry! You lost an action!`;
        success = false;
      }
    }

    // CAST
    if (actionType === 'cast') {
      if (canCast()) {
        const aliveOpponents = game.getAliveTroops(game.opponentPlayer.team);

        message = `${name} cast on all enemies`;

        aliveOpponents.forEach(opponent => {
          opponent.setHealth(opponent.getHealth() - magicPower)
        });

        success = true;
      } else {
        message = `${name} can't cast, sorry! You lost an action!`;
        success = false;
      }
    }

    // SILENCE
    if (actionType === 'silence') {
      if (canSilence()) {
        if (target) {
          const aliveOpponents = game.getAliveTroops(game.opponentPlayer.team);
          const t = aliveOpponents.find(soldier => soldier.getId() === target.getId());

          if (!t) {
            message = `${name} trying to silence: invalid target`;
            success = false;
          } else {
            message = `${name} silence opponent ${t.getName()}`;
            t.addStatus('SILENCED');
            success = true;
          }
        } else {
          message = `${name} can't silence - no target`;
          success = false;
        }

      }
      else {
        message = `${name} can't silence, sorry! You lost an action!`;
        success = false;
      }
    }

    // BLIND
    if (actionType === 'blind') {
      if (canBlind()) {
        if (target) {
          const aliveOpponents = game.getAliveTroops(game.opponentPlayer.team);
          const t = aliveOpponents.find(soldier => soldier.getId() === target.getId());

          if (!t) {
            message = `${name} trying to blind: invalid target`;
            success = false;
          } else {
            message = `${name} blind opponent ${t.getName()}`;
            t.addStatus('BLIND');
            success = true;
          }
        } else {
          message = `${name} can't blind - no target`;
          success = false;
        }

      }
      else {
        message = `${name} can't blind, sorry! You lost an action!`;
        success = false;
      }
    }

    game.currentPlayer.actionDone = {
      tells: tells.map(tell => tell),
      actor: id,
      type: actionType,
      target: target ? target.getId() : null,
      success,
      message
    };


    tells = [];

  };

  // getters
  const getId = () => id;
  const getHealth = () => health;
  const getAttack = () => attack;
  const getName = () => name;
  const getType = () => type;
  const getMotto = () => motto;
  const getMaxHealth = () => maxHealth;
  const getStatus = () => {
    if(health <= 0) {
      return ['DEAD'];
    } else {
      return status.map(s => s)
    }
  };

  // setters
  const setHealth = value => {
    health = Math.min(maxHealth, value);
  };

  const addStatus = s => {
    if (!status.includes(s)) {
      status.push(s)
    }
  };

  const resetStatus = () => {
    if (status.includes('SILENCED')) {
      status.splice(status.indexOf('SILENCED'), 1)
    }
    if (status.includes('BLIND')) {
      status.splice(status.indexOf('BLIND'), 1)
    }
  };

  const info = () => ({
    id,
    type,
    name,
    motto,
    health,
    attack,
    maxHealth,
    magicPower,
    healPower
  });


  return {
    hit,
    heal,
    cast,
    silence,
    blind,
    canHeal,
    canCast,
    canSilence,
    canBlind,
    say,
    // getters
    info,
    getMotto,
    getType,
    getHealth,
    getAttack,
    getName,
    getId,
    getMaxHealth,
    getStatus,
    // setters
    setHealth,
    addStatus,
    resetStatus
  }

}

module.exports = Soldier;
