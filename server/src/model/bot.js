const MongoClient = require('mongodb').MongoClient;

const mongoUrl = 'mongodb://localhost:27017';
// Database Name
const dbName = 'jsfight';
// Create a new MongoClient
const client = new MongoClient(mongoUrl);

module.exports = {

    all: function(userId) {
        return client.connect()
            .then(connection => {

                db = client.db(dbName);
                bots = db.collection('bots');

                return bots.find({user: userId}).toArray()
            })
    },

    one: function(params) {
        return client.connect()
            .then(connection => {

                db = client.db(dbName);
                bots = db.collection('bots');

                return bots.findOne(params)
            })
    }

}