const MongoClient = require('mongodb').MongoClient;

const mongoUrl = 'mongodb://localhost:27017';
// Database Name
const dbName = 'jsfight';
// Create a new MongoClient
const client = new MongoClient(mongoUrl);

let botsCollection;

client.connect()
  .then(() => {
    const db = client.db(dbName);
    botsCollection = db.collection('bots');
  })


module.exports = {

    all: function(userId) {
      return botsCollection.find({user: userId}).toArray()
    },

    allBots: function() {
      return botsCollection.find({}).toArray()
    },

    one: function(params) {
      return botsCollection.findOne(params)
    }

}
