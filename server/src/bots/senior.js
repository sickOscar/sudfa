
class Runner {

  constructor(game) {

    this.game = game;

    this.team = {
      name: "Senior",
      troop: [
        game.Dev(),
        game.Pm(),
        game.Hr(),

      ]
    }

    this.turn = 0;

  }


  run() {


    this.turn++;

    // Your current soldier, which is acting in this turn
    const soldier = this.game.getCurrentSoldier();
    // Reference to the enemy team
    const enemyTeam = this.game.getEnemyTeam();
    // Reference to your team
    const myTeam = this.game.getMyTeam();

    if (soldier.canHeal()) {
      const target = myTeam.getMostDamagedSoldier();
      return soldier.heal(target);
    }

    if (soldier.canRess()) {
      const deadSoldiers = myTeam.getDeadSoldiers();

      if (deadSoldiers.length > 0) {
        return  soldier.ress(deadSoldiers[0])
      } else {
        const target = enemyTeam.getMostDamagedSoldier();
        return soldier.hit(target)
      }
    }

    const target = enemyTeam.getMostDamagedSoldier();
    soldier.hit(target)


  }

}

module.exports = Runner;
