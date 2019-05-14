const MongoClient = require('mongodb').MongoClient;

const mongoUrl = 'mongodb://localhost:27017';
// Database Name
const dbName = 'jsfight';
// Create a new MongoClient
const client = new MongoClient(mongoUrl);

let fightsCollection;
client.connect()
  .then(() => {
    const db = client.db(dbName);
    fightsCollection = db.collection('fights');
  })


module.exports = {

  one: function(params) {
    return fightsCollection.findOne(params)
  }

}
