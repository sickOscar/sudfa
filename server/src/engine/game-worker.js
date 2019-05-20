const { Worker, isMainThread, parentPort } = require('worker_threads');
const Game = require('./game.js');


parentPort.once('message', (message) => {

  const players = JSON.parse(message);

  try {
    const results = launch(players[0], players[1]);
    parentPort.postMessage(JSON.stringify(results));
  } catch (error) {
    console.log('CODE ERROR', error.message);
    parentPort.postMessage(JSON.stringify({
      error: error.message
    }));
  }

})

const loadCode = function(source, gameConsole) {

  const moduleMock = {};
  const requireMock = (el) => {
    throw new Error('NO!');
  };

  const loader = function(module, require, console) {
    eval(source)
  }

  try {
    loader(moduleMock, requireMock, gameConsole)
    if (moduleMock.exports) {
      return moduleMock.exports;
    }
  } catch(err) {
    throw new Error('Invalid source code: ' + err.message)
  }

}

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


  let player1, player2;

  try {

    const Player1 = loadCode(p1.source, game.console);
    player1 = new Player1(gameProxy);

    const Player2 = loadCode(p2.source, game.console);
    player2 = new Player2(gameProxy);

  } catch(err) {
    throw new Error(err);
  }




  game.setupPlayers(player1, player2);

  player1.botid = p1.botid;
  player2.botid = p2.botid;

  const MAX_TURNS = 50;


  let gameOver = false;

  while (game.turn < MAX_TURNS && !gameOver) {

    try {
      game.runTurn()
    } catch(err) {
      // TODO aggiungere gestione errore
      game.history.addTurn({
        error: err.message,
        actor: game.getCurrentSoldier().getId()
      }, game.getState());

    }
    game.currentPlayer.iteration++;

    if (game.isOver()) {
      game.history.setExit(game.currentPlayer.botid, 'WIN', {
        winnerName: game.currentPlayer.team.name
      })
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
      console.log("TIE p2", player2.botid);
      game.history.setExit(player2.botid, 'TIE', {
        winnerName: game.opponentPlayer.team.name
      })
    } else {
      console.log("TIE p1", player2.botid);
      game.history.setExit(player1.botid, 'TIE', {
        winnerName: game.currentPlayer.team.name
      })
    }


  }

  const ret = JSON.parse(JSON.stringify(game.history.state));
  game.history.reset();
  return ret;
}

