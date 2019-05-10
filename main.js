
const Player1 = require('./player1.js');
const Player2 = require('./player2.js');

const Game = require('./game.js');


const game = new Game();

const player1 = new Player1(game)
const player2 = new Player2(game)

game.currentPlayer = player1;
game.opponentPlayer = player2;

game.currentPlayer.iteration = 0;
game.opponentPlayer.iteration = 0;

game.currentPlayer.actionsDone = 0;
game.opponentPlayer.actionsDone = 0;

const MAX_TURNS = 100;

console.log('INIT')
console.log('_______________________');
game.printState()
console.log('_____________________')

const gameInterval = setInterval(() => {
    
    console.log('*********************')

    if (game.turn < MAX_TURNS) {

        try {
            game.currentPlayer.run()
        } catch(err) {
            console.error(err);
        }
        game.currentPlayer.iteration++;

        if (game.isOver()) {

            // GAME OVER
            game.printGameOver(game.currentPlayer)

            clearInterval(gameInterval)
        } else {

            game.togglePlayers()
            game.turn++;

            console.log('_______________________');
            game.printState()
            console.log('_____________________')
        }

    } else {
        clearInterval(gameInterval)
    }

    

    

}, 500)