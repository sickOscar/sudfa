const GameLauncher = require('./game-launcher');
const _ = require('lodash');
const fs = require('fs');
const Bot = require('../model/bot');

const GameArena = {

  start: function (bot) {

    let allBots = []

    // recupera tutti i bot in gioco
    return Bots.all()
      .then(async enemies => {
        allBots = enemies;

        const fights = [];
        let homeFightExample = undefined;

        try {
          for (let i = 0; i < enemies.length; i++) {

            if (bot.botId === enemies[i].botId) {
              continue;
            }

            const homeRun = await GameLauncher.launch(bot, enemies[i]);
            const awayRun = await GameLauncher.launch(enemies[i], bot);

            if (homeRun.error || awayRun.error) {
              throw new Error(homeRun.error || awayRun.error);
            }

            const home = {
              id: `${bot.botId}${enemies[i].botId}`,
              bot1: bot.botId,
              bot2: enemies[i].botId,
              history: homeRun,
              winner: homeRun.exit.winner,
              by: homeRun.exit.by,
              time: new Date()
            };

            const away = {
              id: `${enemies[i].botId}${bot.botId}`,
              bot1: enemies[i].botId,
              bot2: bot.botId,
              history: awayRun,
              winner: awayRun.exit.winner,
              by: awayRun.exit.by,
              time: new Date()
            };

            if (i === 0) {
              homeFightExample = homeRun;
            }

            fights.push(home, away);

          }

          const fightsCollection = db.collection('fights')

          return Promise.all([
              fightsCollection.deleteMany({bot1: bot.botId}),
              fightsCollection.deleteMany({bot2: bot.botId}),
            ])
            .then(() => {
              if (fights.length) {
                return fightsCollection.insertMany(_.flatten(fights))
              }
            })
            .then(connection => {


              const botName = homeFightExample ? homeFightExample.players[0].name : 'Butthole';
              console.log('bot to insert', {...bot, name: botName})

              return bots.updateOne(
                {
                  botId: bot.botId,
                  user: bot.user
                },
                {
                  $set: {
                    botId: bot.botId,
                    source: bot.source,
                    name: botName
                  }
                },
                {upsert: true}
              )
            })
            .then(() => {

              const fightsCollection = db.collection('fights');
              return fightsCollection.aggregate([
                {
                  $group: {
                    _id: '$winner',
                    count: {$sum: 1}
                  }
                },
                {
                  $sort: {
                    count: 1
                  }
                }
              ]).toArray()


            })
            .then(leaderboard => {

              leaderboard = leaderboard.map(bot => {
                const dbBot = allBots.find(b => b.botId === bot._id);
                if (dbBot) {
                  return {
                    count: bot.count,
                    name: dbBot.name,
                    botId: dbBot.id
                  }
                }
                return bot;
              });


              fs.writeFileSync('./leaderboard.json', JSON.stringify(leaderboard.reverse()));
              return {
                exit: 'OK'
              };
            })


        } catch (err) {
          console.log('ERROR', err);
          return {
            exit: 'KO',
            message: err.error
          };
        }


      })


  }


}

module.exports = GameArena
