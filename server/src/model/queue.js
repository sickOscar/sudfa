const { Client } = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});
const _ = require('lodash');

const clientConnected = client.connect();

const FightModel = {

  one: params => {

    const whereClause = Object.keys(params).map((key, i) => {
      return `${key} = $${i + 1}`;
    });

    const query = {
      text: `SELECT * FROM queue WHERE ${whereClause.join(' AND ')}`,
      values: Object.values(params)
    };

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows[0])
  },

  first: () => {
    const query = {
      text: `SELECT * FROM queue ORDER BY timestamp DESC LIMIT 1`
    };

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows[0])
  },

  add: function(bot) {

    const columns = Object.keys(bot).map(col => `"${col}"`);
    const indexes = Object.values(bot).map((val, i) => {
      return `$${i + 1}`;
    });

    const text = `INSERT INTO queue (${columns.join(', ')}) VALUES (${indexes.join(', ')}) RETURNING *`;
    const values = Object.values(bot).map(v => {
      if (Array.isArray(v)) return JSON.stringify(v)
      return v;
    });

    const query = {
      text,
      values
    };

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows[0])
  },

  delete: params => {
    const whereClause = Object.keys(params).map((key, i) => {
      return `"${key}" = $${i +1}`;
    });

    const query = {
      text: `DELETE FROM queue WHERE ${whereClause.join(' AND ')}`,
      values: Object.values(params)
    };

    return clientConnected
      .then(() => client.query(query))
  }

};

module.exports = FightModel;
