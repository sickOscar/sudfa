
class Runner {

  constructor(game) {

    this.game = game;

    this.team = {
      name: 'Guru',
      troop: [
        game.Dev(),
        game.Pm(),
        game.Pm(),

      ]
    }

  }


  run() {

    // Your current soldier, which is acting in this turn
    const soldier = this.game.getCurrentSoldier();
    // Reference to the enemy team
    const enemyTeam = this.game.getEnemyTeam();
    // Reference to your team
    const myTeam = this.game.getMyTeam();

    // Simple AI
    if (soldier.canHeal()) {
      console.log('can heal')
      soldier.heal(myTeam.getMostDamagedSoldier())
    } else {
      const target = enemyTeam.getMostDamagedSoldier();
      soldier.hit(target);
    }


  }

}

module.exports = Runner;

