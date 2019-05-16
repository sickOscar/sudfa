const GameLauncher = require('../engine/game-launcher');
const {jwtCheck} = require('./auth');
const GameArena = require('../engine/game-arena');
const Bot = require('../model/bot');
const League = require('../model/league');
const Fight = require('../model/fight');
const fs = require('fs');

const botFolder = `${__dirname}/../bots/`;

class GameApi {

  constructor(app) {

    /**
     *
     */
    app.post('/source', jwtCheck, (req, res) => {

      const userId = req.user.sub;
      const botId = req.body.bot;
      let code = req.body.source;
      const level = req.body.level;

      code = code.replace('/n', '');
      code = code.replace('/r', '');

      let pl2Source = null;

      switch (level) {
        case 'senior':
          pl2Source = fs.readFileSync(botFolder + 'senior.js').toString();
          break;
        case 'mid-level':
          pl2Source = fs.readFileSync(botFolder + 'mid-level.js').toString();
          break;
        case 'guru':
          pl2Source = fs.readFileSync(botFolder + 'guru.js').toString();
          break;
        case 'junior':
        default:
          pl2Source = fs.readFileSync(botFolder + 'junior.js').toString();
          break;
      }

      GameLauncher.launch(
        {
          source: code,
          user: userId,
          botId: botId
        },
        {
          source: pl2Source,
          botId: level
        })
        .then(gameHistory => {
          res.json(gameHistory)
        })
        .catch(error => {
          res.send(error)
        })


    })

    /**
     *
     */
    app.post('/league', jwtCheck, (req, res) => {

      let code = req.body.source;
      code = code.replace('/n', '');
      code = code.replace('/r', '');

      GameArena.start({
          source: code,
          botId: req.body.botId,
          user: req.user.sub
        })
        .then(response => {
          res.json(response)
        })
        .catch(error => {
          console.error(error);
          res.status(500).send({error: error});
        })


    })

    app.get('/leaderboard', (req, res) => {
      res.json(JSON.parse(League.leaderboard()))
    })

    app.get('/fight/:bot1/:bot2', (req, res) => {

      Promise.all([
          Bot.one({botId: req.params.bot1}),
          Bot.one({botId: req.params.bot2}),
          Fight.one({
            bot1: req.params.bot1,
            bot2: req.params.bot2
          }),
          Fight.one({
            bot2: req.params.bot1,
            bot1: req.params.bot2
          }),
        ])
        .then(results => {

          res.json({
            bots: [results[0], results[1]],
            fights: [results[2], results[3]]
          })


        })
        .catch(err => {
          console.error(err)
          res.status(500).send(err)
        })

    })

    app.get('/API', (req, res) => {
      res.send(fs.readFileSync('./src/API.md').toString());
    })

  }

}

module.exports = (function() {

  let instance = null

  const getInstance = function(app) {
    if (!instance) {
      instance = new GameApi(app);
    }
    return instance;
  }

  return {
    getInstance
  }

}())
