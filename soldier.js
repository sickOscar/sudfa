
function Soldier(game, options) {

    const id = Math.random().toString(36).substring(2);
    const type = options.type;
    const name = options.name || options.type;
    const motto = options.motto || "Random quote";
    
    let health = 0;
    let attack = 0;
    let magicPower = 0;
    let maxHealth = 0;
    
    switch (options.type) {
        case 'dev':
            health = maxHealth = 10;
            attack = 3;
            break;
        case 'pm':
            health = maxHealth =  10;
            attack = 2;
            healPower = 4;
            break;
        case 'mktg':
            health = maxHealth =  5;
            attack = 1;
            healPower = 4;
            magicPower = 2;
            break;
        default:
            throw new Error('Invalid soldier type')
    }

    const hit = (target) => {
        doAction('hit', target)
    }

    const heal = (target) => {
        doAction('heal', target)
    }

    const cast = () => {
        doAction('cast')
    }

    const canHeal = () => {
        return type === 'pm' || type === 'mktg';
    }

    const canCast = () => {
        return type === 'mktg';
    }

    const doAction = (actionType, target) => {
        if (game.currentPlayer.actionsDone > game.currentPlayer.iteration) {
            throw new Error('You can do only one action per turn');
        }

        // HIT
        if (actionType === 'hit') {
            const aliveOpponents = game.getAliveTroops(game.opponentPlayer.team);
            const t = aliveOpponents.find(soldier => soldier.getId() === target.getId());

            console.log(name + ' attack opponent', t.getName())
            t.setHealth(t.getHealth() - attack);
        }

        // HEAL 
        if (actionType === 'heal') {
            if (canHeal()) {
                const aliveCompanions = game.getAliveTroops(game.currentPlayer.team);
                const t = aliveCompanions.find(soldier => soldier.getId() === target.getId());
    
                if (!t) {
                    console.log('Trying to heal: invalid target');
                } else {
                    console.log(`${name} heals companion ${t.getName()}`)
                    t.setHealth(Math.min( maxHealth,  t.getHealth() + healPower ))
                }

            } else {
                console.log(`${name} can't heal, sorry! You lost an action!`);
            }
        }

        // CAST 
        if (actionType === 'cast') {
            if (canCast()) {
                const aliveOpponents = game.getAliveTroops(game.opponentPlayer.team);
    
                console.log(`${name} cast on all enemies`)

                aliveOpponents.forEach(opponent => {
                    opponent.setHealth(opponent.getHealth() - magicPower)
                })
                

            } else {
                console.log(`${name} can't heal, sorry! You lost an action!`);
            }
        }

        game.currentPlayer.actionsDone++;
    }

    // getters
    const getId = () => id;
    const getHealth = () => health;
    const getAttack = () => attack;
    const getName = () => name;
    const getType = () => type;
    const getMotto = () => motto;

    // setters
    const setHealth = value => {
        health = Math.min(maxHealth, value);
    }


    return {
        hit,
        heal,
        cast,
        canHeal,
        canCast,
        // getters
        getMotto,
        getType,
        getHealth,
        getAttack,
        getName,
        getId,
        // setters
        setHealth
    }

}

module.exports = Soldier;