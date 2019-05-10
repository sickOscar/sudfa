class Runner {

    constructor(game) {

        this.game = game;
        
        this.team = {
            name: 'DEVASTO', 
            troop: [
                game.Dev(),
                game.Pm(),
                game.Mktg()
            ]
        }

        this.game.registerTeam(this.team);

    }

    getMyMostDamaged() {
        const myTeam = this.team.troop;
        let weakest = {getHealth: () => 100};
        for(let i = 0; i < myTeam.length; i++) {
            if (myTeam[i].getHealth() > 0 && weakest.getHealth() > myTeam[i].getHealth()) {
                weakest = myTeam[i]
            }
        } 
        return weakest;
    }

    run() {

        const soldier = this.game.getCurrentSoldier();
        const enemyTeam = this.game.getEnemyTeam();

        console.log(`${this.team.name} | ${soldier.getName()} turn`);
        
        const target = enemyTeam.getWeakestSoldier();

        if (soldier.canHeal()) {
            let t = this.getMyMostDamaged()
            soldier.heal(t);
        } else {
            soldier.hit(target);
        }

    }

}

module.exports = Runner;