const { Client } = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

const clientConnected = client.connect();

module.exports = {

    myBots: function(userId) {

      const query = {
        text: `SELECT * FROM bots WHERE "user" = $1`,
        values: [userId]
      };

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows)

    },

    allBots: function() {
      const query = {
          text: `SELECT * FROM bots`,
      };

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows)
    },

    one: function(params) {
      const whereClause = Object.keys(params).map((key, i) => {
        return `"${key}" = $${i+1}`;
      });

      const text = `SELECT * FROM bots WHERE ${whereClause.join(' AND ')}`;
      const values = Object.values(params);

      const query = {
        text,
        values
      };

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows[0])
    },

    all: function() {
      const query = {
        text: `SELECT * FROM bots`
      };

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows)

    },

    add: function(bot) {

      const columns = Object.keys(bot).map(col => `"${col}"`);
      const indexes = Object.values(bot).map((val, i) => {
        return `$${i + 1}`;
      });

      const text = `INSERT INTO bots (${columns.join(', ')}) VALUES (${indexes.join(', ')}) RETURNING *`;
      const values = Object.values(bot);

      const query = {
        text,
        values
      };

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows[0])
    },

    update: function(whereCondition, updates) {

      if (!Object.keys(whereCondition) || !Object.keys(updates)) {
        throw new Error('Invalid bot update');
      }

      let index = 1;
      const values = [];

      const whereFields = Object.keys(whereCondition);
      const whereClause = [];

      for (let i = 0; i < whereFields.length; i++) {
        whereClause.push(`"${whereFields[i]}" = $${index}`);
        values.push(whereCondition[whereFields[i]]);
        index++;
      }

      const updateFields = Object.keys(updates);
      const setClause = [];

      for (let i = 0; i < updateFields.length; i++) {
        setClause.push(`"${updateFields[i]}" = $${index}`);
        values.push(updates[updateFields[i]]);
        index++;
      }

      const text = `UPDATE bots SET ${setClause.join(', ')} WHERE ${whereClause.join(' AND ')} RETURNING *`;

      const query = {text, values};

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows[0])

    }

};
