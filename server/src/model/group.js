const {Client} = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

const clientConnected = client.connect();

module.exports = class Groups {


  static async userGroups(userId) {
    const query = {
      text: `
          SELECT *, (SELECT COUNT(*) FROM groups_users WHERE group_id = GU.group_id) as players
          FROM groups
                   JOIN
               groups_users GU ON GU.group_id = groups.id
          WHERE GU.user_id = $1
      `,
      values: [userId]
    };

    const groups = await clientConnected
      .then(() => client.query(query))
      .then(results => results.rows)

    const groupIds = groups.map(g => `'${g.id}'`);
    const botsQuery = `
        SELECT bots.botid, bots.name, bots.user, bots.team, bots.group 
        FROM bots
        WHERE bots.group IN (${groupIds.join(',')})
    `;
    const bots = await client.query(botsQuery)
      .then(results => results.rows)

    return groups.map(group => {
      group.bots = bots.filter(b => b.group === group.id);
      return group;
    });

  }

  static botGroups(botId) {

    const query = {
      text: `
          SELECT *
          from groups
                   JOIN
               groups_bots ON groups.id = groups_bots.group_id
          WHERE groups_bots.bot_id = $1
      `,
      values: [botId]
    };

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows)

  }

  static add(group) {

    const columns = Object.keys(group).map(col => `"${col}"`);
    const indexes = Object.values(group).map((val, i) => {
      return `$${i + 1}`;
    });

    const text = `INSERT INTO groups (${columns.join(', ')}) VALUES (${indexes.join(', ')}) RETURNING *`;
    const values = Object.values(group).map(v => {
      if (Array.isArray(v)) return JSON.stringify(v);
      return v;
    });

    const query = {
      text,
      values
    };

    return clientConnected
      .then(() => client.query(query))
      .then(results => {
        const addedGroup = results.rows[0];
        return [
          Groups.addUserToGroup(addedGroup.id, group.owner),
          addedGroup
        ]
      })
      .then(([addedRelation, addedGroup]) => addedGroup)

  }

  static addUserToGroup(groupId, userId) {

    const text = `INSERT INTO groups_users (group_id, user_id)
                  VALUES ($1, $2)`;

    const query = {
      text,
      values: [groupId, userId]
    };

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows[0])

  }

  static addBotToGroup(groupId, botId) {
    const text = `INSERT INTO groups_bots (group_id, bot_id)
                  VALUES ($1, $2)`;

    const query = {
      text,
      values: [groupId, botId]
    };

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows[0])
  }


}
