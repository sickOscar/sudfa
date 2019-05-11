
const Player1 = require('./player1.js');
const Player2 = require('./player2.js');

const Game = require('./game.js');


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

const player1 = new Player1(gameProxy)
const player2 = new Player2(gameProxy)

game.setupPlayers(player1, player2)


const MAX_TURNS = 50;

console.log('INIT')
console.log('_______________________');
game.printState()
console.log('_____________________')

const gameInterval = setInterval(() => {
    
    console.log('*********************')

    if (game.turn < MAX_TURNS) {

        try {
            game.runTurn()
        } catch(err) {
            console.error(err);
        }
        game.currentPlayer.iteration++;

        if (game.isOver()) {
            // GAME OVER
            game.printGameOver(game.currentPlayer)

            // console.log(JSON.stringify(game.history, null, 2))

            clearInterval(gameInterval)
        } else {

            if (game.shouldTogglePlayers()) {
                game.togglePlayers()    
            }
            
            game.turn++;

            console.log('_______________________');
            game.printState()
            console.log('_____________________')
        }

    } else {

        console.log('END TURNS')
        console.log('_______________________');
        game.printState()
        console.log('_____________________')

        // console.log(game.history)
        game.checkWinner()

        clearInterval(gameInterval)
    }

    

    

}, 200)