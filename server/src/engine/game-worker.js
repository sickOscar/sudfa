const { Worker, isMainThread, parentPort } = require('worker_threads');
const Game = require('./game.js');

const loadCode = function(source, gameConsole) {

  const moduleMock = {};
  const requireMock = (el) => {
    throw new Error('NO!');
  };
  let errorMock = null;

  const loader = function(module, require, error, console) {
    try {
      eval(source)
    } catch(err) {
      error = err;
    }
  }

  loader(moduleMock, requireMock, errorMock, gameConsole)

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


  const Player1 = loadCode(p1.source, game.console);
  const Player2 = loadCode(p2.source, game.console);

  const player1 = new Player1(gameProxy);
  const player2 = new Player2(gameProxy);

  game.setupPlayers(player1, player2);

  player1.botId = p1.botId;
  player2.botId = p2.botId;

  const MAX_TURNS = 50;


  let gameOver = false;

  while (game.turn < MAX_TURNS && !gameOver) {

    try {
      game.runTurn()
    } catch(err) {
      // TODO aggiungere gestione errore
      console.error(err);
    }
    game.currentPlayer.iteration++;

    if (game.isOver()) {
      // GAME OVER
      // game.printGameOver(game.currentPlayer)
      game.history.setExit(game.currentPlayer.botId, 'WIN')
      gameOver = true;
    } else {

      if (game.shouldTogglePlayers()) {
        game.togglePlayers()
      }

      game.turn++;

    }
  }

  if (game.turn === MAX_TURNS) {

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

