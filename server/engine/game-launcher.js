const Game = require('./game.js');
const fs = require('fs');

const botFolder = `${__dirname}/../bots/`;

const loadCode = function(source) {
    const loadedModule = {};
    const require = (el) => {
        throw new Error('NO!');
    };
    (function(module, require) {
        eval(source)
    }(loadedModule, require))
    return loadedModule.exports
}

const launch = function(options) {

    const pl1Source = options.source;

    let pl2Source = null;

    switch (options.level) {
        case 'senior':
            pl2Source = fs.readFileSync(botFolder + 'mid-level.js').toString();
            break;
        case 'mid-level':
            pl2Source = fs.readFileSync(botFolder + 'mid-level.js').toString();
            break;
        case 'junior':
        default:
            pl2Source = fs.readFileSync(botFolder + 'junior.js').toString();
            break;
    }

    console.log(pl2Source);

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


    const Player1 = loadCode(pl1Source)
    const Player2 = loadCode(pl2Source)

    const player1 = new Player1(gameProxy)
    const player2 = new Player2(gameProxy)

    game.setupPlayers(player1, player2)


    const MAX_TURNS = 50;

    console.log('INIT')
    console.log('_______________________');
    game.printState()
    console.log('_____________________')

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
            game.history.setExit(game.currentPlayer.team.name, 'WIN')
            gameOver = true;
        } else {

            if (game.shouldTogglePlayers()) {
                game.togglePlayers()    
            }
            
            game.turn++;

            console.log('_______________________');
            game.printState()
            console.log('_____________________')
        }
    }

    if (game.turn === MAX_TURNS) {
        console.log('END TURNS')
            console.log('_______________________');
            game.printState()
            console.log('_____________________')

            game.history.setExit(game.checkWinner(), 'TIE')
    }

    const ret = Object.assign({}, ...game.history.state)
    game.history.reset();
    return ret;

}



module.exports = (function() {
    return {
        launch
    }
}())