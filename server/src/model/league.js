const fs = require('fs')

module.exports = {

  leaderboard: async function () {
    return await new Promise((resolve, reject) => {
      fs.readFile('./leaderboard.json', (err, content) => {
        if (err) {
          return reject(err)
        }
        resolve(JSON.parse(content.toString()))
      })
    })
  }

}
