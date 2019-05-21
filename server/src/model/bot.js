const { Client } = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

const clientConnected = client.connect();

module.exports = {

    myBots: function(userId, table) {

      table = table || 'bots';

      const query = {
        text: `SELECT * FROM ${table} WHERE "user" = $1`,
        values: [userId]
      };

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows)

    },

    allBots: function(table) {

      table = table || 'bots';

      const query = {
          text: `SELECT * FROM ${table}`,
      };

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows)
    },

    one: function(params, table) {

      table = table || 'bots'

      const whereClause = Object.keys(params).map((key, i) => {
        return `"${key}" = $${i+1}`;
      });

      const text = `SELECT * FROM ${table} WHERE ${whereClause.join(' AND ')}`;
      const values = Object.values(params);

      const query = {
        text,
        values
      };

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows[0])
    },

    all: function(table) {

      table = table || 'bots';

      const query = {
        text: `SELECT * FROM ${table}`
      };

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows)

    },

    add: function(bot, table) {

      table = table || 'bots';

      const columns = Object.keys(bot).map(col => `"${col}"`);
      const indexes = Object.values(bot).map((val, i) => {
        return `$${i + 1}`;
      });

      const text = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${indexes.join(', ')}) RETURNING *`;
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

    update: function(whereCondition, updates, table) {

      table = table || 'bots';

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

        let clause = `"${updateFields[i]}" = $${index}`;
        if (updateFields[i] === 'timestamp') {
          clause = `"${updateFields[i]}" = to_timestamp($${index})`;
        }

        setClause.push(clause);

        let v = updates[updateFields[i]];
        if (Array.isArray(v)) {
          v = JSON.stringify(v)
        }
        values.push(v);

        index++;
      }

      const text = `UPDATE ${table} SET ${setClause.join(', ')} WHERE ${whereClause.join(' AND ')} RETURNING *`;

      const query = {text, values};

      return clientConnected
        .then(() => client.query(query))
        .then(results => results.rows[0])

    }

};
