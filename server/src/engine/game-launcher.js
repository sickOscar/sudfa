
const { Worker, isMainThread, parentPort } = require('worker_threads');





const launch = function(p1, p2) {

  if (isMainThread) {

    const worker = new Worker('./src/engine/game-worker.js');
    worker.postMessage(JSON.stringify([p1, p2]));

    return new Promise((resolve, reject) => {
      const errorTimeout = setTimeout(() => {
        worker.terminate();
        console.error('Game is taking too long to complete');
        reject({
          error: "Game is taking too long, maybe infinite loop?"
        });
      }, 1000)

      worker.once('message', (message) => {
        clearTimeout(errorTimeout);
        resolve(JSON.parse(message))  // Prints 'Hello, world!'.
      });



    })

  }

}



module.exports = (function() {
    return {
        launch
    }
}())
