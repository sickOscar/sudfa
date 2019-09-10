const {jwtCheck} = require('./auth');
const GameArena = require('../engine/game-arena');
const Bot = require('../model/bot');
const League = require('../model/league');
const GameQueue = require('../engine/game-queue');
const Queue = require('../model/queue');
const Fight = require('../model/fight');
const fs = require('fs');

const queue = GameQueue.getInstance();

class GameApi {

  constructor(app) {


    app.get('/fights', (req, res) => {

      const bots = req.query.bots;
      const against = req.query.against;

      Fight.ofBotsAgainst(bots.split(','), against)
        .then(fights => {

          res.json(fights.map(f => {
            delete f.history;
            delete f.time;
            return f;
          }))
        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err);
        })

    });

    /**
     *
     */
    app.post('/source', jwtCheck, (req, res) => {

      const userId = req.user.sub;
      const botid = req.body.bot;
      let code = req.body.source;
      const level = req.body.level;
      const challenge = req.body.challenge;

      code = code.replace('/n', '');
      code = code.replace('/r', '');

      // CHALLENGE A USER BOT
      if (challenge) {
        const fightParams = {
          userId,
          botid,
          code,
          challenge
        };
        return GameArena.singleChallengeFight(fightParams)
          .then(gameHistory => {
            res.json(gameHistory)
          })
          .catch(error => {
            console.error(error);
            res.send(error)
          })

      }

      const fightParams = {
        userId,
        botid,
        level,
        code
      };

      return GameArena.singleBotFight(fightParams)
        .then(gameHistory => {
          res.json(gameHistory)
        })
        .catch(error => {
          console.error(error);
          res.send(error)
        })

    });

    /**
     *
     */
    app.post('/league', jwtCheck, (req, res) => {

      let code = req.body.source;
      code = code.replace('/n', '');
      code = code.replace('/r', '');

      // exec a single fight to fulfill bot table
      const fightParams = {
        userId: req.user.sub,
        botid: req.body.botid,
        code: req.body.source,
        group: req.body.group,
        level: 'junior'
      };
      GameArena.singleBotFight(fightParams)
        .then(gameHistory => {
          queue.add({
              source: code,
              botid: req.body.botid,
              user: req.user.sub,
              group: req.body.group
            })
            .then(response => {
              res.json(response)
            })
        })
        .catch(error => {
          console.error(error);
          res.status(500).send({error: error});
        })

    });

    app.get('/leaderboard/:group?', (req, res) => {
      League.leaderboard(req.params.group)
        .then(leaderboard => {
          res.json(leaderboard)
        })
        .catch(error => {
          res.status(500).send('Unable to load leaderboard');
        })
    });

    app.get('/fight/:bot1/:bot2', (req, res) => {

      Promise.all([
        Bot.one({botid: req.params.bot1}, 'league_bots'),
        Bot.one({botid: req.params.bot2}, 'league_bots'),
        Fight.one({
          bot1: req.params.bot1,
          bot2: req.params.bot2
        }),
        Fight.one({
          bot1: req.params.bot2,
          bot2: req.params.bot1
        }),
      ])
        .then(results => {

          res.json({
            bots: [results[0], results[1]],
            fights: [results[2], results[3]]
          })


        })
        .catch(err => {
          console.error(err);
          res.status(500).send(err)
        })

    });

    app.get('/API', (req, res) => {
      fs.readFile('./src/API.md', (err, content) => {
        if (err) {
          return res.satus(500).send('Unabl to open API')
        }
        res.send(content.toString());
      })

    });

    app.get('/queue/:botid', jwtCheck, (req, res) => {


      Queue.one({
        user: req.user.sub,
        botid: req.params.botid
      })
        .then(queueEl => {

          if (queueEl) {

            if (queueEl.status === 'started') {
              res.send(queueEl)
            }

            if (queueEl.status === 'fail') {
              res.send({
                exit: 'KO'
              })
            }

          } else {
            res.send({
              exit: 'OK'
            })
          }
        })

    });

    app.get('/rerun', (req, res) => {
      GameArena.rerun()
        .then(response => {
          res.json(response)
        })
        .catch(error => {
          console.error(error);
          res.status(500).send({error: error});
        })
    })

    app.get('/db/:botid', (req, res) => {

      if (!req.params.botid) {
        res.send('NO BOT ID');
      }

      console.log('DELETING LEAGUE BOT', req.params.botid);

      Promise.all([
        Fight.delete({bot1: req.params.botid}),
        Fight.delete({bot2: req.params.botid}),
        ])
        .then(async results => {
          await Bot.delete({botid: req.params.botid}, 'league_bots')
          return GameArena.rerun()
        })
        .then(response => {
          res.send('OK')
        })
        .catch(error => {
          res.status(500).send(error);
        })
    })

  }

}

module.exports = (function () {

  let instance = null;

  const getInstance = function (app) {
    if (!instance) {
      instance = new GameApi(app);
    }
    return instance;
  };

  return {
    getInstance
  }

}());
