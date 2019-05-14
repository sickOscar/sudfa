const GameLauncher = require('./game-launcher');
const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');
const fs = require('fs');

const mongoUrl = 'mongodb://localhost:27017';
// Database Name
const dbName = 'jsfight';
// Create a new MongoClient
const client = new MongoClient(mongoUrl);

const GameArena = {
    
    start: function(bot) {

        let db;
        let bots;
        
        return client.connect()
            .then(connection => {

                db = client.db(dbName);
                bots = db.collection('bots');

                console.log('bot to insert', bot)

                return bots.updateOne(
                    {botId: bot.botId, user: bot.user}, 
                    {$set: {
                        botId: bot.botId,
                        source: bot.source 
                    }},
                    { upsert: true }
                    )
            })
            .then(operation => {
                // recupera tutti i bot in gioco
                return bots.find({}).toArray()
            })        
            .then(enemies => {

                // lancia il gioco contro tutti i bot
                const fights = enemies.map(enemy => {

                    const homeRun = GameLauncher.launch(bot, enemy);

                    const home = {
                        id: `${bot.botId}${enemy.botId}`,
                        bot1: bot.botId,
                        bot2: enemy.botId,
                        history: homeRun,
                        winner: homeRun.exit.winner,
                        by: homeRun.exit.by,
                        time: new Date()
                    }

                    const awayRun = GameLauncher.launch(enemy, bot);

                    const away = {
                        id: `${enemy.botId}${bot.botId}`,
                        bot1: enemy.botId,
                        bot2: bot.botId,
                        history: awayRun,
                        winner: awayRun.exit.winner,
                        by: awayRun.exit.by,
                        time: new Date()
                    }

                    return [home, away];
                    
                })
                
                const fightsCollection = db.collection('fights')

                console.log(_.flatten(fights));

                return Promise.all([
                    fightsCollection.deleteMany({bot1: bot.botId}),
                    fightsCollection.deleteMany({bot2: bot.botId}),
                ])
                .then(() => {
                    return fightsCollection.insertMany(_.flatten(fights))
                })
                .then(() => {
                    
                    const fightsCollection = db.collection('fights');
                    return fightsCollection.aggregate([
                        {
                            $group:{
                                _id: '$winner',
                                count: { $sum: 1}
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
                    fs.writeFileSync('./leaderboard.json', JSON.stringify(leaderboard.reverse()));
                    return 'OK';
                })

            })

    }

    
}

module.exports = GameArena