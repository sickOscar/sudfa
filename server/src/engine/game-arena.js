const GameLauncher = require('./game-launcher');
const _ = require('lodash');
const fs = require('fs');
const Bots = require('../model/bot');
const Fights = require('../model/fight');

const LEAGUE_BOTS_TABLE = 'league_bots';

const GameArena = {

  start: function (bot) {

    let allBots = [];

    // recupera tutti i bot in gioco
    return Bots.all(LEAGUE_BOTS_TABLE)
      .then(async enemies => {
        allBots = enemies;

        const fights = [];
        let homeFightExample = undefined;

        try {
          for (let i = 0; i < enemies.length; i++) {

            if (bot.botid === enemies[i].botid) {
              continue;
            }

            const homeRun = await GameLauncher.launch(bot, enemies[i]);
            const awayRun = await GameLauncher.launch(enemies[i], bot);

            if (homeRun.error || awayRun.error) {
              console.error(homeRun.error || awayRun.error);
              throw new Error(homeRun.error || awayRun.error);
            }

            const home = {
              id: `${bot.botid}${enemies[i].botid}`,
              bot1: bot.botid,
              bot2: enemies[i].botid,
              history: homeRun,
              winner: homeRun.exit.winner,
              by: homeRun.exit.by,
              time: new Date()
            };

            const away = {
              id: `${enemies[i].botid}${bot.botid}`,
              bot1: enemies[i].botid,
              bot2: bot.botid,
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

          console.log(`Game arena completed for ${bot.botid}: ${fights.length} fights`)


          return Promise.all([
            Fights.delete({bot1: bot.botid}),
            Fights.delete({bot2: bot.botid}),
          ])
            .then(() => {
              if (fights.length) {

                // controllo che il bot ci sia a db, altrimenti lo creo
                return Bots.one({botid: bot.botid, user: bot.user})
                  .then(dbBot => {
                    if (!dbBot) {

                      // add to bots
                      return Bots.add({
                        botid: bot.botid,
                        source: bot.source,
                        // prendo il nome dal primo combattimento,
                        // il bot corrente combatte per primo in casa
                        name: fights[0].history.players[0].name,
                        user: bot.user,
                        team: homeFightExample.players[0].troop.map(s => s.type)
                      })


                    } else {
                      return dbBot;
                    }
                })

              }
            })
            .then(() => {
              return Fights.addMany(_.flatten(fights))
            })
            .then(() => {

              const botName = homeFightExample ? homeFightExample.players[0].name : 'Butthole';

              // update bot
              return Bots.update(
                {
                  botid: bot.botid,
                  user: bot.user
                },
                {
                  source: bot.source,
                  name: botName,
                  team: homeFightExample ? homeFightExample.players[0].troop.map(s => s.type) : []
                }
              )
                .then(bot => {

                  // controllo che esista in league
                  return Bots.one({botid: bot.botid, user: bot.user}, LEAGUE_BOTS_TABLE)
                    .then(dbBot => {
                      if (dbBot) {
                        // update in league
                        return Bots.update(
                          {
                            botid: dbBot.botid,
                            user: dbBot.user
                          },
                          {
                            source: bot.source,
                            name: botName,
                            team: homeFightExample ? homeFightExample.players[0].troop.map(s => s.type): []
                          },
                          LEAGUE_BOTS_TABLE
                        )
                      } else {
                        // add to league
                        return Bots.add({
                          botid: bot.botid,
                          source: bot.source,
                          // prendo il nome dal primo combattimento,
                          // il bot corrente combatte per primo in casa
                          name: fights[0].history.players[0].name,
                          user: bot.user,
                          team: homeFightExample.players[0].troop.map(s => s.type)
                        }, LEAGUE_BOTS_TABLE)
                      }
                    })

                })
            })
            .then(() => {
              return Fights.computeLeaderboard();
            })
            .then(leaderboard => {
              fs.writeFileSync('./leaderboard.json', JSON.stringify(leaderboard));
              return {
                exit: 'OK'
              };
            })


        } catch (err) {
          console.error(err);
          return {
            exit: 'KO',
            message: err.error
          };
        }


      })


  }


}

module.exports = GameArena
