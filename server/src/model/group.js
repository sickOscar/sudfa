const {Client} = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

const clientConnected = client.connect();

class Groups {


  static userGroups(userId) {
    const query = {
      text: `
      SELECT * from groups 
        JOIN 
          groups_users ON groups.id = groups_users.group_id
        WHERE
          groups_users.user_id = $1  
      `,
      values: [userId]
    };

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows)
  }

  static botGroups(botId) {

    const query = {
      text: `
      SELECT * from groups 
        JOIN 
          groups_bots ON groups.id = groups_bots.group_id
        WHERE
          groups_bots.bot_id = $1  
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

        return Groups.addUserToGroup(addedGroup.id, group.userId);
      })
      .then(results => results.rows[0])

  }

  static addUserToGroup(groupId, userId) {

    const text = `INSERT INTO groups_users (group_id, user_id) VALUES ($1, $2)`;

    const query = {
      text,
      values: [groupId, userId]
    };

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows[0])

  }

  static addBotToGroup(groupId, botId) {
    const text = `INSERT INTO groups_bots (group_id, bot_id) VALUES ($1, $2)`;

    const query = {
      text,
      values: [groupId, botId]
    };

    return clientConnected
      .then(() => client.query(query))
      .then(results => results.rows[0])
  }


}
