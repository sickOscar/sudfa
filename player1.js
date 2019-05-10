class Runner {

    constructor(game) {

        this.game = game;
        
        this.team = {
            name: 'PORCODDIO', 
            troop: [
                game.Dev(),
                game.Dev(),
                game.Dev()
            ]
        }

        this.game.registerTeam(this.team);

    }

    


    run() {

        const soldier = this.game.getCurrentSoldier();
        const enemyTeam = this.game.getEnemyTeam();

        console.log(`${this.team.name} | ${soldier.getName()} turn`);
        
        const target = enemyTeam.getWeakestSoldier();
        // soldier.hit(target);



        // if (soldier.canCast()) {
        //     soldier.cast();
        // } else {
            soldier.hit(target);
        // }
    }

}

module.exports = Runner;