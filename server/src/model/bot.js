const { Client } = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

const clientConnected = client.connect()

module.exports = {

    myBots: function(userId) {

      console.log("MYBOTS userId", userId);

      const query = {
        text: `SELECT * FROM bots WHERE user = $1`,
        values: [userId]
      }

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows)

    },

    allBots: function() {
      const query = {
          text: `SELECT * FROM bots`,
      }

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows)
    },

    one: function(params) {
      const whereClause = Object.keys(params).map((key, i) => {
        return `${key} = $${i+1}`;
      })

      const query = {
        text: `SELECT * FROM bots WHERE ${whereClause.join(' AND ')}`,
        values: Object.values(params)
      }

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows[0])
    },

    all: function() {
      const query = {
        text: `SELECT * FROM bots`
      }

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows)

    }

}
