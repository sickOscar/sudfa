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
      return `${key} = $${i + 1}`;
    });

    const query = {
      text: `SELECT * FROM fights WHERE ${whereClause.join(' AND ')}`,
      values: Object.values(params)
    };

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows[0])
  },

  ofBotsAgainst: (botIds, against) => {

    const whereClause = botIds.map((botid, i) => {
      return `(bot1 = $1 AND bot2 = $${i + 2}) OR (bot1 = $${i + 2} AND bot2 = $1)`;
    });

    const text = `SELECT * FROM fights WHERE ${whereClause.join(' OR ')}`;

    const query = {
      text,
      values: [against, ...botIds]
    };

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows)
  },

  addMany: fights => {

    if (fights.length === 0) {
      return Promise.resolve([]);
    }

    const sanitizedColumns = _.omitBy(fights[0], _.isNil);
    const columns = Object.keys(sanitizedColumns).map(col => {
      if (col === 'group') {
        return `"group"`;
      }
      return col;
    });

    let index = 0;
    const insertKeys = fights
      .map(fight => {
        return _.omitBy(fight, _.isNil)
      })
      .map((fight, i) => {
        const indexes = Object.values(fight).map((val, j) => {
          if (columns[j] === 'timestamp') {
            return `to_timestamp($${++index})`
          }
          return `$${++index}`
        });
        return `( ${indexes.join(', ')} )`
      });

    const insertValues = _.flatten(fights.map(fight => Object.values(_.omitBy(fight, _.isNil))));

    const query = {
      text: `INSERT INTO fights (${columns.join(', ')}) VALUES ${insertKeys.join(', ')} RETURNING *`,
      values: insertValues
    };

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows)
  },

  delete: params => {

    const sanitizedParams = _.omitBy(params, _.isNil);

    const whereClause = Object.keys(sanitizedParams).map((key, i) => {
      return `"${key}" = $${i +1}`;
    });

    const query = {
      text: `DELETE FROM fights WHERE ${whereClause.join(' AND ')}`,
      values: Object.values(sanitizedParams)
    };

    return clientConnected
      .then(() => client.query(query))
  },

  truncate: (group) => {

    let queryText = '';

    if (!group) {
      queryText = `DELETE FROM fights WHERE "group" IS NULL;`;
    }

    const query = {
      text: queryText,
    }
    return clientConnected
      .then(() => client.query(query))
  },

  computeLeaderboard: (group) => {

    let text = '';
    let values = [];

    console.log('compute leaderboard for', group);

    if (!group) {
      text = `
        SELECT
            users.id, users.name as username, league_bots.botid as botid, league_bots.name, league_bots.team as team, ties.ties, ties.TIES_POINTS, wins.wins, wins.win_POINTS, COALESCE(wins.win_POINTS,0) + COALESCE(ties.TIES_POINTS, 0) as POINTS
        FROM
            league_bots
            LEFT JOIN (
                SELECT
                    winner, count(*) as TIES, count(*) * 1 as TIES_POINTS
                FROM
                    fights
                WHERE
                        by = 'TIE'
                GROUP BY
                    winner
            ) as ties ON ties.winner = league_bots.botid
            LEFT JOIN (
                SELECT
                    winner, count(*) as wins, count(*) * 3 as win_POINTS
                FROM
                    fights
                WHERE
                        by = 'WIN'
                GROUP BY
                    winner
            ) as wins ON wins.winner = league_bots.botid
            INNER JOIN users
                ON (league_bots.user = users.id)
            WHERE league_bots.group IS NULL 
            ORDER BY points DESC, wins.wins DESC, ties.ties DESC
            
        `
    } else {
      text = `
        SELECT
            users.id, users.name as username, league_bots.botid as botid, league_bots.name, league_bots.team as team, ties.ties, ties.TIES_POINTS, wins.wins, wins.win_POINTS, COALESCE(wins.win_POINTS,0) + COALESCE(ties.TIES_POINTS, 0) as POINTS
        FROM
            league_bots
            LEFT JOIN (
                SELECT
                    winner, count(*) as TIES, count(*) * 1 as TIES_POINTS
                FROM
                    fights
                WHERE
                        by = 'TIE' AND "group" = $1
                GROUP BY
                    winner
            ) as ties ON ties.winner = league_bots.botid
            LEFT JOIN (
                SELECT
                    winner, count(*) as wins, count(*) * 3 as win_POINTS
                FROM
                    fights
                WHERE
                        by = 'WIN' AND "group" = $1
                GROUP BY
                    winner
            ) as wins ON wins.winner = league_bots.botid
            INNER JOIN users
                ON (league_bots.user = users.id)
            WHERE league_bots.group = $1
            ORDER BY points DESC, wins.wins DESC, ties.ties DESC
            
        `;
      values =[group]
    }



    const query = {text, values};

    return clientConnected
      .then(() => client.query(query))
      .then(results => {
        return results.rows
      } )

  }

};

module.exports = FightModel;
