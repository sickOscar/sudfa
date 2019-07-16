const Totem = require('./totem');

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
  let poisonDamage = 0;

  let poisonedFor = 0;

  let tells = [];

  let totems = [];

  switch (options.type) {
    case 'dev':
      health = maxHealth = 24;
      attack = 3;
      break;
    case 'pm':
      health = maxHealth = 20;
      attack = 2;
      healPower = 5;
      break;
    case 'hr':
      health = maxHealth = 18;
      attack = 1;
      break;
    case 'mktg':
      health = maxHealth = 15;
      attack = 1;
      // healPower = 1;
      magicPower = 2;
      poisonDamage = 2;
      break;
    default:
      throw new Error('Invalid soldier type')
  }

  const hit = (target) => {
    doAction.call(this, 'hit', target)
  };

  const protect = (target) => {
    doAction.call(this, 'protect', target)
  };

  const heal = (target) => {
    doAction.call(this, 'heal', target)
  };

  const cast = () => {
    doAction.call(this, 'cast')
  };

  const silence = (target) => {
    doAction.call(this, 'silence', target)
  };

  const blind = (target) => {
    doAction.call(this, 'blind', target)
  };

  const poison = (target) => {
    doAction.call(this, 'poison', target)
  };

  const ress = (target) => {
    doAction.call(this, 'ress', target);
  }

  const summon = (totemType) => {
    doAction.call(this, 'summon', game.getCurrentSoldier(), {totemType});
  }

  const canHit = () => {
    return !status.includes('BLIND');
  };

  const canProtect = () => {
    return type === 'dev' && !status.includes('SILENCED');
  };

  const canHeal = () => {
    return type === 'pm' && !status.includes('SILENCED');
  };

  const canCast = () => {
    return type === 'mktg' && !status.includes('SILENCED');
  };

  const canSilence = () => {
    return type === 'pm' && !status.includes('SILENCED');
  };

  const canBlind = () => {
    return type === 'pm' && !status.includes('SILENCED');
  };

  const canPoison = () => {
    return type === 'mktg' && !status.includes('SILENCED');
  };

  const canRess = () => {
    return type === 'hr' && !status.includes('SILENCED');
  }

  const canSummon = () => {
    return type === 'hr' && !status.includes('SILENCED') && totems.length < 3;
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


  const doAction = (actionType, target, actionOptions) => {

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
          let t = aliveOpponents.find(soldier => soldier.getId() === target.getId());

          if (!t) {
            // check if attacking a totem
            const opponentTotems = aliveOpponents
              .filter(opponent => opponent.getType() === 'hr')
              .flatMap(hr => {
                return hr.getFullTotems();
              })
            t = opponentTotems.find(totem => totem.getId() === target.getId());
          }

          if (!t) {
            message = `${name} fails to attack! Invalid target`;
            success = false
          } else {

            if (t.getStatus().includes('PROTECTED')) {
              // remove protected
              t.removeStatus('PROTECTED');
              message = `${name} attacks ${t.getName()} - attack failed / active protection`;
              success = true;
            } else {

              const aliveCompanions = game.getAliveTroops(game.currentPlayer.team);
              const hrs = aliveCompanions.filter(s => s.canSummon())

              let attackBuff = 0;
              for (let i = 0; i < hrs.length; i++) {
                const totems = hrs[i].getTotems();
                totems.forEach(totem => {
                  if (totem.getType() === 'physical_attack') {
                    attackBuff++;
                  }
                })
              }

              let attackNerf = 0;
              aliveOpponents
                .filter(s => s.canSummon())
                .forEach(soldier => {
                  soldier.getTotems().forEach(totem => {
                    if (totem.getType() === 'physical_defense') {
                      attackNerf++;
                    }
                  })
                })

              const finalAttackValue = Math.max(0, attack + attackBuff - attackNerf);
              t.setHealth(t.getHealth() - finalAttackValue);
              message = `${name} attacks ${t.getName()} - ${finalAttackValue} damage`;
              success = true;
            }

          }

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

    // PROTECT
    if (actionType === 'protect') {
      if (canProtect()) {

        if (target) {
          const aliveCompanions = game.getAliveTroops(game.currentPlayer.team);
          const t = aliveCompanions.find(soldier => soldier.getId() === target.getId());

          if (!t) {
            message = `${name} trying to protect: invalid target`;
            success = false;
          } else {
            if (!t.getStatus().includes('PROTECTED')) {
              message = `${name} protects companion ${t.getName()}`;
              t.addStatus('PROTECTED');
            } else {
              message = `${name} - ${t.getName()} already protected`;
            }

            success = true;
          }
        } else {
          message = `${name} can't protect - no target`;
          success = false;
        }


      } else {
        message = `${name} can't protect, sorry! You lost an action!`;
        success = false;
      }
    }

    // CAST
    if (actionType === 'cast') {
      if (canCast()) {
        const aliveOpponents = game.getAliveTroops(game.opponentPlayer.team);

        message = `${name} cast on all enemies`;

        aliveOpponents.forEach(opponent => {
          if (opponent.getStatus().includes('PROTECTED')) {
            opponent.removeStatus('PROTECTED');
            // opponent.setHealth(opponent.getHealth() - Math.floor(magicPower /2))
          } else {

            const aliveCompanions = game.getAliveTroops(game.currentPlayer.team);
            const hrs = aliveCompanions.filter(s => s.canSummon())

            let attackBuff = 0;
            for (let i = 0; i < hrs.length; i++) {
              const totems = hrs[i].getTotems();
              totems.forEach(totem => {
                if (totem.getType() === 'magic_attack') {
                  attackBuff++;
                }
              })
            }

            let attackNerf = 0;
            aliveOpponents
              .filter(s => s.canSummon())
              .forEach(soldier => {
                soldier.getTotems().forEach(totem => {
                  if (totem.getType() === 'magic_defense') {
                    attackNerf++;
                  }
                })
              })

            const magicDamage = Math.max(0, magicPower + attackBuff - attackNerf);
            opponent.setHealth(opponent.getHealth() - magicDamage)
          }
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

    // POISON
    if (actionType === 'poison') {
      if (canPoison()) {
        if (target) {
          const aliveOpponents = game.getAliveTroops(game.opponentPlayer.team);
          const t = aliveOpponents.find(soldier => soldier.getId() === target.getId());

          if (!t) {
            message = `${name} trying to poison: invalid target`;
            success = false;
          } else {
            message = `${name} poison opponent ${t.getName()}`;
            if (!t.getStatus().includes('POISONED')) {

              if (!t.getStatus().includes('PROTECTED')) {
                t.removeStatus('PROTECTED')
              } else {
                t.setHealth(t.getHealth() - poisonDamage);
              }
            }
            t.addStatus('POISONED');
            success = true;
          }
        } else {
          message = `${name} can't poison - no target`;
          success = false;
        }

      }
      else {
        message = `${name} can't poison, sorry! You lost an action!`;
        success = false;
      }
    }

    // RESS
    if (actionType === 'ress') {
      if (canRess()) {
        if (target) {
          const companions = game.getCurrentTroops();
          const t = companions.find(soldier => soldier.getId() === target.getId());

          if (!t) {
            message = `${name} trying to ress: invalid target`;
            success = false;
          } else {

            if (t.getHealth() > 0) {
              message = `Can't ress alive companion :(`;
              success = false;
            } else {
              message = `${name} ress companion ${t.getName()}`;
              t.setHealth(Math.ceil(t.getMaxHealth() / 2));
              success = true;
            }

          }
        } else {
          message = `${name} can't ress - no target`;
          success = false;
        }
      }
    }

    // SUMMON
    if (actionType === 'summon') {
      if (canSummon()) {
        const allowedTotems = ['physical_attack', 'phisical_defense', 'magic_attack', 'magic_defense'];
        if (allowedTotems.includes(actionOptions.totemType)) {
          const newTotem = Totem(actionOptions.totemType);
          totems.push(newTotem);
          message = `${name} summons totem`;
          success = true;
        } else {
          message = `${name} tries to summon totem: invalid type`;
          success = false;
        }
      } else {
        message = `${name} can't summon now`;
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

    if (status.includes('POISONED')) {
      health = health - poisonDamage;
    }

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

  const totemProxy = t => {
    return {
      getId: t.getId.bind(t),
      getDuration: t.getDuration.bind(t),
      getHealth: t.getHealth.bind(t),
      getType: t.getType.bind(t),
      getName: t.getName.bind(t),
      getStatus: t.getStatus.bind(t)
    }
  }

  const getTotems = () => totems.map(totemProxy);

  const getFullTotems = () => totems;

  // setters
  const setHealth = value => {
    health = Math.min(maxHealth, value);
  };

  const addStatus = s => {
    if (!status.includes(s)) {
      status.push(s)
    }

    if (s === 'POISONED') {
      poisonedFor = 2;
    }
  };

  const removeStatus = s => {
    status.splice(status.indexOf(s), 1)
  }

  const resetStatus = () => {
    if (status.includes('SILENCED')) {
      status.splice(status.indexOf('SILENCED'), 1)
    }
    if (status.includes('BLIND')) {
      status.splice(status.indexOf('BLIND'), 1)
    }
    if (status.includes('POISONED')) {
      poisonedFor--;
      if (poisonedFor === 0) {
        status.splice(status.indexOf('POISONED'), 1)
      }
    }
  };

  const updateTotemsDurations = () => {
    totems = totems
      .map(t => {
        t.setDuration(t.getDuration() - 1);
        return t;
      })
  }

  const updateTotems = () => {
    if (type === 'hr') {
      if (health <= 0) {
        totems = [];
      } else {
        totems = totems
          .filter(t => {
            return t.getHealth() > 0 && t.getDuration() > 0;
          })
      }
    }
  }

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
    poison,
    protect,
    ress,
    summon,
    canHeal,
    canCast,
    canSilence,
    canBlind,
    canPoison,
    canProtect,
    canRess,
    canSummon,
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
    getTotems,
    getFullTotems,
    // setters
    setHealth,
    addStatus,
    resetStatus,
    updateTotemsDurations,
    updateTotems,
    removeStatus
  }

}

module.exports = Soldier;
