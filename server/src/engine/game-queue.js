const Queue  = require('../model/queue');
const GameArena = require('./game-arena');

class GameQueue {

  constructor() {
    this.timeout = 0;

    this.tick();
  }

  async tick() {
    const firstInQueue = await Queue.first();
    if (firstInQueue) {
      console.log('got first');
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

    await Queue.delete({
      botid: firstInQueue.botid
    });

    // start timeout
    this.tick();
  }

  async add(bot) {
    const {botid, source, user} = bot;

    // check if already there
    const botInQueue = await Queue.one({botid});

    if (botInQueue) {
      throw new Error('Already in queue');
    }

    return Queue.add({
      id: `${(+new Date())}_${user}`,
      botid,
      source,
      user
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
