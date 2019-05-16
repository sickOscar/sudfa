const { Client } = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

const clientConnected = client.connect()

module.exports = {

  one: function(params) {
    const whereClause = Object.keys(params).map((key, i) => {
      return `${key} = $${i+1}`;
    })

    const query = {
      text: `SELECT * FROM users WHERE ${whereClause.join(' AND ')}`,
      values: Object.values(params)
    }

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows[0])
  },

  add: function(authId) {
    const query = {
      text: `INSERT INTO users(id, auth_id) VALUES($1, $2) RETURNING *`,
      values: [authId, authId]
    }

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows[0])

  },

  update: function(id, fields) {

    const setClause = Object.keys(fields).map((key, i) => {
      return `${key} = $${i+2}`;
    })

    const query = {
      text: `UPDATE users SET ${setClause.join(', ')} WHERE id = $1 RETURNING *`,
      values: [id, ...Object.values(fields)]
    }

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows[0])
  },

  all: function() {
    const query = {
      text: `SELECT * FROM users`
    }

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows)

  }

}
