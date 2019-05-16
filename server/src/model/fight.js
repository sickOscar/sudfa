const { Client } = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

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
      .then(() => {
        client.query(query)
      })
  }

}
