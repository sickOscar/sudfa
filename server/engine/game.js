const Soldier = require('./soldier');
const History = require('./history');

class Game {

    constructor() {
        this.teams = [];
        this.turn = 0;

        this.currentPlayer = null;
        this.opponentPlayer = null;

        this.history = History.getInstance();
    }

    shouldTogglePlayers() {
        return true;
    }

    togglePlayers() {
        let c = this.currentPlayer;
        this.currentPlayer = this.opponentPlayer;
        this.opponentPlayer = c;
    }

    registerTeam(team) {
        this.teams.push(team);
    }

    setupPlayers(player1, player2) {
        this.registerTeam(player1.team);
        this.registerTeam(player2.team);

        this.currentPlayer = player1;
        this.opponentPlayer = player2;

        this.currentPlayer.iteration = 0;
        this.opponentPlayer.iteration = 0;

        this.currentPlayer.actionDone = false;
        this.opponentPlayer.actionDone = false;

        this.history.setPlayers(player1, player2);
    }

    runTurn() {
        console.log(`${this.currentPlayer.team.name} | turn`);

        const currentSoldier = this.getCurrentSoldier();
        if (currentSoldier.getHealth() <= 0) {
            console.log(`${currentSoldier.getName()} | DEAD SOLDIER`)
        } else {
            this.currentPlayer.run();    
        }

        if (this.currentPlayer.actionDone) {
            this.history.addTurn(this.currentPlayer.actionDone, this.getState());    
        }

        

        // reset player
        this.currentPlayer.actionDone = false;
    }

    getState() {
        return {
            teams: this.teams.map(team => {
                return team.troop.reduce((final, soldier) => {
                    final[soldier.getId()] = {
                        health: soldier.getHealth(),
                        status: soldier.getStatus()
                    }
                    return final;
                }, {}) 
            })
        }
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

        console.log('FINAL STATE');
        this.printState();

        console.log('The Winner is', player.team.name);
    }

    getCurrentTroops() {
        return this.currentPlayer.team.troop;
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
        const aliveSoldiers = this.getCurrentTroops();
        let soldierIndex = this.currentPlayer.iteration % aliveSoldiers.length;
        return this.mySoldierProxy(aliveSoldiers[soldierIndex]);
    }

    mySoldierProxy(soldier) {
        return {
            hit: soldier.hit.bind(soldier),
            heal: soldier.heal.bind(soldier),
            cast: soldier.cast.bind(soldier),
            canHeal: soldier.canHeal.bind(soldier),
            canCast: soldier.canCast.bind(soldier),
            // getters
            getMotto: soldier.getMotto.bind(soldier),
            getType: soldier.getType.bind(soldier),
            getHealth: soldier.getHealth.bind(soldier),
            getAttack: soldier.getAttack.bind(soldier),
            getName: soldier.getName.bind(soldier),
            getId: soldier.getId.bind(soldier),
            getMaxHealth: soldier.getMaxHealth.bind(soldier),
            getStatus: soldier.getStatus.bind(soldier)
        }
    }

    opponentSoldierProxy(soldier) {
        return {
            getType: soldier.getType.bind(soldier),
            getId: soldier.getId.bind(soldier),
            getHealth: soldier.getHealth.bind(soldier),
            getAttack: soldier.getAttack.bind(soldier),
            getMaxHealth: soldier.getMaxHealth.bind(soldier),
            getStatus: soldier.getStatus.bind(soldier)
        }
    }

    teamProxy(team, soldierProxy) {
        return {
            getFirstSoldier: () => {
                return soldierProxy(team.shift());
            },
            getLastSoldier: () => {
                return soldierProxy(team.pop());
            },
            getStrongestSoldier: () => {
                let strongest = {getAttack: () => 0};
                for(let i = 0; i < team.length; i++) {
                    if (strongest.getAttack() < team[i].getAttack()) {
                        strongest = team[i]
                    }
                } 
                return soldierProxy(strongest);
            },
            getWeakestSoldier: () => {
                let weakest = {getAttack: () => 100};
                for(let i = 0; i < team.length; i++) {
                    if (weakest.getAttack() > team[i].getAttack()) {
                        weakest = team[i]
                    }
                } 
                return soldierProxy(weakest);
            },
            getMostDamagedSoldier: () => {
                let mostDamaged = {getHealth: () => 100};
                for(let i = 0; i < team.length; i++) {
                    if (team[i].getHealth() > 0 &&  mostDamaged.getHealth() > team[i].getHealth()) {
                        mostDamaged = team[i]
                    }
                } 
                return soldierProxy(mostDamaged);
            },
            getHealer: () => {
                for(let i = 0; i < team.length; i++) {
                    if (team[i].getHealth() > 0 && team[i].getType() === 'pm') {
                        return team[i];    
                    }
                }
            }
        }
    }

    getEnemyTeam() {
        const enemyTeam = this.getAliveTroops(this.opponentPlayer.team);
        return this.teamProxy(enemyTeam, this.opponentSoldierProxy)
    }

    getMyTeam() {
        const myTeam = this.getAliveTroops(this.currentPlayer.team);
        return this.teamProxy(myTeam, this.mySoldierProxy)
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

    checkWinner() {
        const player1AliveTroop = this.getAliveTroops(this.teams[0]);
        const player2AliveTroop = this.getAliveTroops(this.teams[1]);

        let winner = null;

        if (player1AliveTroop.length === player2AliveTroop.length) {
            

            const p1HealthSum = player1AliveTroop.reduce((sum, next) => sum + next.getHealth(), 0)
            const p2HealthSum = player2AliveTroop.reduce((sum, next) => sum + next.getHealth(), 0)

            if (p1HealthSum === p2HealthSum) {
                // in caso di parità, vince il secondo
                winner = 1;
            } else if (p1HealthSum > p2HealthSum) {
                winner = 0;
            } else {
                winner = 1;
            }

        } else if (player1AliveTroop.length > player2AliveTroop.length) {
            winner = 0;
        } else {
            winner = 1;
        }

        return winner;
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