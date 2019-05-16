const {jwtCheck} = require('./auth');
const Bot = require('../model/bot');

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

    app.get('/bot/:id', jwtCheck, (req, res) => {
      const user = req.user.sub;

      Bot.one({user, botid: req.params.id})
        .then(bot => {

          if (bot) {
            res.json(bot)
          } else {
            res.json({
              botId: req.params.id
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

module.exports = (function() {

  let instance = null

  const getInstance = function(app) {
    if (!instance) {
      instance = new BotApi(app);
    }
    return instance;
  }

  return {
    getInstance
  }

}())
