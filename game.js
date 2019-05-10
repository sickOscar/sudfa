const Soldier = require('./soldier');

class Game {

    constructor() {
        this.teams = [];
        this.turn = 0;

        this.currentPlayer = null;
        this.opponentPlayer = null;
    }

    togglePlayers() {
        let c = this.currentPlayer;
        this.currentPlayer = this.opponentPlayer;
        this.opponentPlayer = c;
    }

    registerTeam(team) {
        this.teams.push(team);
    }

    printState() {
        this.teams.forEach(team => {
            console.log(team.name);
            console.log(
                `${team.troop[0].getName()}: ${team.troop[0].getHealth()} | ${team.troop[1].getName()} : ${team.troop[1].getHealth()} | ${team.troop[2].getName()} : ${team.troop[2].getHealth()}`
            )
        })
    }

    printGameOver(player) {
        console.log('GAME OVER!!!!')

        console.log('The Winner is', player.team.name);
    }

    getAliveTroops(team) {
        let aliveTroops = [];
        for (let i = 0; i < team.troop.length; i++) {
            if (team.troop[i].getHealth() > 0) {
                aliveTroops.push(team.troop[i])
            }
        }
        return aliveTroops;
    }

    getCurrentSoldier() {
        const aliveSoldiers = this.getAliveTroops(this.currentPlayer.team);
        let soldierIndex = this.currentPlayer.iteration % aliveSoldiers.length;
        return this.mySoldierProxy(aliveSoldiers[soldierIndex]);
    }

    mySoldierProxy(soldier) {
        return {
            hit: soldier.hit,
            heal: soldier.heal,
            cast: soldier.cast,
            canHeal: soldier.canHeal,
            canCast: soldier.canCast,
            // getters
            getMotto: soldier.getMotto,
            getType: soldier.getType,
            getHealth: soldier.getHealth,
            getAttack: soldier.getAttack,
            getName: soldier.getName,
            getId: soldier.getId
        }
    }

    opponentSoldierProxy(soldier) {
        return {
            getType: soldier.getType,
            getId: soldier.getId,
            getHealth: soldier.getHealth,
            getAttack: soldier.getAttack
        }
    }

    getEnemyTeam() {

        const enemyTeam = this.getAliveTroops(this.opponentPlayer.team);

        return {
            getFirstSoldier: () => {
                return this.opponentSoldierProxy(enemyTeam.shift());
            },
            getLastSoldier: () => {
                return this.opponentSoldierProxy(enemyTeam.pop());
            },
            getStrongestSoldier: () => {
                let strongest = {getAttack: () => 0};
                for(let i = 0; i < enemyTeam.length; i++) {
                    if (strongest.getAttack() < enemyTeam[i].getAttack()) {
                        strongest = enemyTeam[i]
                    }
                } 
                return this.opponentSoldierProxy(strongest);
            },
            getWeakestSoldier: () => {
                let weakest = {getAttack: () => 100};
                for(let i = 0; i < enemyTeam.length; i++) {
                    if (weakest.getAttack() > enemyTeam[i].getAttack()) {
                        weakest = enemyTeam[i]
                    }
                } 
                return this.opponentSoldierProxy(weakest);
            }
        }

    }

    isOver() {
        // controllo salute dei membri tel opponentTeam
        let gameover = false;
        // se tutti i giocatori di un team sono morti
        if (this.getAliveTroops(this.opponentPlayer.team).length === 0) {
            gameover = true;
        }
        if (gameover) {
            return true;
        }
        return false
    }

    Dev(options) {
        return new Soldier(this, {
            ...options,
            type: 'dev'
        })
    }

    Pm(options) {
        return new Soldier(this, {
            ...options,
            type: 'pm'
        })
    }

    Mktg(options) {
        return new Soldier(this, {
            ...options,
            type: 'mktg'
        })
    }

}

module.exports = Game;