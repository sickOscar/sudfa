const { Worker, isMainThread, parentPort } = require('worker_threads');
const Game = require('./game.js');

const loadCode = function(source) {

  const moduleMock = {};
  const requireMock = (el) => {
    throw new Error('NO!');
  };
  let errorMock = null;

  const loader = function(module, require, error) {
    try {
      eval(source)
    } catch(err) {
      error = err;
    }
  }

  loader(moduleMock, requireMock, errorMock)

  if (!errorMock) {
    return moduleMock.exports
  } else {
    throw new Error('Invalid source file')
  }

}


parentPort.once('message', (message) => {

  const players = JSON.parse(message);

  const results = launch(players[0], players[1]);

  parentPort.postMessage(JSON.stringify(results));
})



const launch = function(p1, p2) {
  const game = new Game();

  const gameProxy = (function(game) {
    return {
      getCurrentSoldier: game.getCurrentSoldier.bind(game),
      getEnemyTeam: game.getEnemyTeam.bind(game),
      getMyTeam: game.getMyTeam.bind(game),
      registerTeam: game.registerTeam.bind(game),
      Dev: game.Dev.bind(game),
      Pm: game.Pm.bind(game),
      Mktg: game.Mktg.bind(game)
    }
  }(game));


  const Player1 = loadCode(p1.source)
  const Player2 = loadCode(p2.source)

  const player1 = new Player1(gameProxy)
  const player2 = new Player2(gameProxy)

  game.setupPlayers(player1, player2)

  player1.botId = p1.botId;
  player2.botId = p2.botId;

  const MAX_TURNS = 50;

  // console.log('INIT')
  // console.log('_______________________');
  // game.printState()
  // console.log('_____________________')

  let gameOver = false;

  while (game.turn < MAX_TURNS && !gameOver) {

    console.log('*********************')
    try {
      game.runTurn()
    } catch(err) {
      console.error(err);
    }
    game.currentPlayer.iteration++;

    if (game.isOver()) {
      // GAME OVER
      game.printGameOver(game.currentPlayer)
      game.history.setExit(game.currentPlayer.botId, 'WIN')
      gameOver = true;
    } else {

      if (game.shouldTogglePlayers()) {
        game.togglePlayers()
      }

      game.turn++;

      // console.log('_______________________');
      // game.printState()
      // console.log('_____________________')
    }
  }

  if (game.turn === MAX_TURNS) {
    // console.log('END TURNS')
    //     console.log('_______________________');
    //     game.printState()
    //     console.log('_____________________')

    if (game.checkWinner()) {
      game.history.setExit(player2.botId, 'TIE')
    } else {
      game.history.setExit(player1.botId, 'TIE')
    }


  }

  const ret = JSON.parse(JSON.stringify(game.history.state));
  game.history.reset();
  return ret;
}

