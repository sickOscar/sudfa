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
      return `queue.${key} = $${i + 1}`;
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
      text: `
        SELECT * 
        FROM queue 
        WHERE 
              status IS NULL OR (status != 'fail' AND status != 'started')
        ORDER BY "timestamp" DESC LIMIT 1`
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

  update: function(whereCondition, updates) {

    if (!Object.keys(whereCondition) || !Object.keys(updates)) {
      throw new Error('Invalid queue update');
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

    const text = `UPDATE queue SET ${setClause.join(', ')} WHERE ${whereClause.join(' AND ')} RETURNING *`;

    console.log("text", text, values);
    
    const query = {text, values};

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
