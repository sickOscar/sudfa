const { Client } = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});
const _ = require('lodash');

const clientConnected = client.connect()

const FightModel = {

  one: params => {

    const whereClause = Object.keys(params).map((key, i) => {
      return `${key} = $${i}`;
    })

    const query = {
      text: `SELECT * FROM fights WHERE ${whereClause.join(' AND ')}`,
      values: Object.values(params)
    }

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows[0])
  },

  addMany: fights => {

    if (fights.length === 0) {
      return Promise.resolve([]);
    }

    const columns = Object.keys(fights[0])
    const index = 1;
    const insertKeys = fights.map((fight, i) => {
      const indexes = Object.values(fight).map(val => {
        return `$${index}`
      })
      return `( ${indexes.join(', ')} )`
    })

    console.log("insertKeys", insertKeys);

    const insertValues = _.flatten(fights.map(fight => Object.values(fight)))

    console.log("insertValues", insertValues);

    const query = {
      text: `INSERT INTO fights (${columns.join(', ')}) VALUES ${insertKeys.join(', ')} RETURNING *`,
      values: insertValues
    }

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows)
  },

  delete: params => {
    const whereClause = Object.keys(params).map((key, i) => {
      return `${key} = $${i}`;
    })

    const query = {
      text: `DELETE FROM fights WHERE ${whereClause.join(' AND ')}`,
      values: Object.values(params)
    }

    return clientConnected
      .then(() => client.query(query))
  }

}
