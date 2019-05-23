const {jwtCheck} = require('./auth');
const Bot = require('../model/bot');
const GameArena = require('../engine/game-arena');

class BotApi {

  constructor(app) {


    app.get('/mybots', jwtCheck, (req, res) => {
      const user = req.user.sub;
      Bot.myBots(user)
        .then(bots => {
          res.json(bots);
        })
        .catch(error => {
          res.status(500).send(error)
        })
    });

    app.get('/myleaguebots', jwtCheck, (req, res) => {
      const user = req.user.sub;
      Bot.myBots(user, 'league_bots')
        .then(bots => {
          res.json(bots);
        })
        .catch(error => {
          res.status(500).send(error)
        })
    });

    app.get('/bots', jwtCheck, (req, res) => {

      Bot.allBots()
        .then(bots => {
          res.json(bots)
        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err);
        })

    });

    app.get('/league_bots', jwtCheck, (req, res) => {

      Bot.allBots('league_bots')
        .then(bots => {
          res.json(bots)
        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err);
        })

    });

    app.post('/bot/:id', jwtCheck, (req, res) => {
      const user = req.user.sub;

      const fightParams = {
        userId: user,
        botid: req.params.id,
        level: 'junior',
        code: req.body.source
      }

      return GameArena.singleBotFight(fightParams)
        .then(gameHistory => {
          res.json(gameHistory)
        })
        .catch(error => {
          console.error(error)
          res.send(error)
        })

    });

    app.get('/bot/:id', jwtCheck, (req, res) => {
      const user = req.user.sub;

      return Promise.all([
        Bot.one({user, botid: req.params.id}),
        Bot.one({user, botid: req.params.id}, 'league_bots')
      ])
        .then(bots => {

          const bot = bots[0];
          const leagueBot = bots[1];

          if (leagueBot) {
            bot.leagueBot = leagueBot;
          }

          if (bot) {
            res.json(bot)
          } else {
            res.json({
              botid: req.params.id
            })
          }

        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err.message)
        })
    })

  }

}

module.exports = (function () {

  let instance = null

  const getInstance = function (app) {
    if (!instance) {
      instance = new BotApi(app);
    }
    return instance;
  }

  return {
    getInstance
  }

}())
