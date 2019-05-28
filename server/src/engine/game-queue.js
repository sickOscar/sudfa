const Queue  = require('../model/queue');
const GameArena = require('./game-arena');

class GameQueue {

  constructor() {
    this.timeout = 0;
  }

  async tick() {
    const firstInQueue = await GameQueue.first()
    if (firstInQueue) {
      clearTimeout(this.timeout);
      this.startArena(firstInQueue);
    } else {
      this.timeout = setTimeout(() => {
        this.tick();
      }, 1000)
    }
  }

  async startArena(firstInQueue) {
    console.log('START ARENA FOR', JSON.stringify(firstInQueue));

    // start arena
    const arenaResults = await GameArena.start({
        source: firstInQueue.source,
        botid: firstInQueue.botid,
        user: firstInQueue.user
      });



    // start timeout
    this.tick();
  }

  add(bot) {
    const {botid, source, user} = bot;
    return Queue.add({
      id: `${(+new Date())}_${user}`,
      botid,
      source
    })
  }

}

module.exports = (function() {

  let instance = null;

  const getInstance = () => {
    if (!instance) {
      instance = new GameQueue();
    }
    return instance;
  };

  return {
    getInstance
  }

}());
