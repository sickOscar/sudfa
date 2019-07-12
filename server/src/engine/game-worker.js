const { parentPort } = require('worker_threads');
const Game = require('./game.js');
const {NodeVM}  = require('vm2');
const random = require('random');
const seedrandom = require('seedrandom');

random.use(seedrandom('trololololo'));

const MAX_TURNS = 100;

/**
 *
 * Event emitter to the main thread
 *
 */
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

});

/**
 *
 * @param source
 * @param gameConsole console mock
 */
const loadCode = function(source, gameConsole) {

  const moduleMock = {};

  const loader = function(module, console) {

    Math.random = () => {
      return random.float();
    };

    const sandbox = {
      console, Math
    };

    const secureSource = `'use strict'; ${source}`;

    const vm = new NodeVM({
      timeout: 100,
      sandbox,
      eval: false,
      wasm: false
    })

    return vm.run(secureSource);
  };

  try {
    return loader(moduleMock, gameConsole);
  } catch(err) {
    console.error(err)
    throw new Error('Invalid source code: ' + err.message)
  }

};

/**
 * Fix team name
 * Rules:
 * - should exists
 * - less than 40 chars
 *
 * @param name
 * @return {string}
 */
const fixTeamName = function(name) {
  if (!name || typeof name !== 'string') {
    return 'Team Name';
  }
  if (name.length > 40) {
    return name.substr(0, 40);
  }
  return name;
}

/**
 *
 * @param p1 player1 source code
 * @param p2 player2 source code
 * @return {any}
 */
const launch = function(p1, p2) {

  const game = new Game();

  let player1, player2;

  const gameProxy = {
    'getCurrentSoldier': game.getCurrentSoldier.bind(game),
    'getEnemyTeam': game.getEnemyTeam.bind(game),
    'getMyTeam': game.getMyTeam.bind(game),
    'Dev': game.Dev.bind(game),
    'Pm': game.Pm.bind(game),
    'Mktg': game.Mktg.bind(game)
  }

  const Player1 = loadCode(p1.source, game.console);
  player1 = new Player1(gameProxy);
  player1.team.name = fixTeamName(player1.team.name);

  const Player2 = loadCode(p2.source, game.console);
  player2 = new Player2(gameProxy);
  player2.team.name = fixTeamName(player2.team.name);


  if (player1.team.troop.length > 3) {
    player1.team.troop = [player1.team.troop[0], player2.team.troop[1], player1.team.troop[2]];
  }

  if (player2.team.troop.length > 3) {
    player2.team.troop = [player2.team.troop[0], player2.team.troop[1], player2.team.troop[2]];
  }

  game.setupPlayers(player1, player2);

  player1.botid = p1.botid;
  player2.botid = p2.botid;

  let gameOver = false;

  while (game.turn < MAX_TURNS && !gameOver) {

    try {
      game.runTurn()
    } catch(err) {
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

