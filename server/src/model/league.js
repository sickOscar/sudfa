const fs = require('fs')

module.exports = {

    leaderboard: function() {

        return fs.readFileSync('./leaderboard.json').toString();

    }

}