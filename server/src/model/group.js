const {Client} = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});
const _ = require('lodash');
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
          ORDER BY groups.name
      `,
      values: [userId]
    };

    const groups = await clientConnected
      .then(() => client.query(query))
      .then(results => results.rows)

    let bots = [];

    if (groups.length > 0) {
      const groupIds = groups.map(g => `'${g.id}'`);
      const botsQuery = `
        SELECT bots.botid, bots.name, bots.user, bots.team, bots.group 
        FROM bots
        WHERE bots.group IN (${groupIds.join(',')})
    `;
      bots = await client.query(botsQuery)
        .then(results => results.rows)
    }

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

  static one(params) {
    const table = 'groups';

    const whereClause = Object.keys(params).map((key, i) => {
      return `"${key}" = $${i + 1}`;
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
  }

  static async add(group) {

    const getCreatedGroupsCountQuery = {
      text: 'SELECT count(*) FROM groups WHERE owner = $1',
      values: [group.owner]
    }

    const countResults = await clientConnected
      .then(() => client.query(getCreatedGroupsCountQuery))
      .then(results => results.rows[0]);

    if (countResults.count >= 3) {
      throw new Error('Max 3 leagues');
    }

    const existingGroup = await Groups.one({name: group.name});
    if (existingGroup) {
      throw new Error('A group with this name already exists');
    }

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
          Groups.addUserToGroup(addedGroup.name, group.owner),
          addedGroup
        ]
      })
      .then(([addedRelation, addedGroup]) => addedGroup)

  }

  static async addUserToGroup(groupName, userId) {

    // check group existence
    const existingGroup = await Groups.one({name: groupName});

    if (!existingGroup) {
      throw new Error('Unable to find a valid group');
    }

    const text = `INSERT INTO groups_users (group_id, user_id)
                  VALUES ($1, $2) RETURNING *`;

    const query = {
      text,
      values: [existingGroup.id, userId]
    };

    return clientConnected
      .then(() => client.query(query))
      .then(results => {
        return existingGroup;
      })

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

  static update(whereCondition, updates) {

    const table = 'groups';

    const sanitizedWhere = _.omitBy(whereCondition, _.isNil);
    const sanitizedUpdates = _.omitBy(updates, _.isNil);

    if (!Object.keys(sanitizedWhere) || !Object.keys(sanitizedUpdates)) {
      throw new Error('Invalid group update');
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

  static async delete(groupId, userId) {
    // check if user is owner
    const ownershipQuery = {
      text: 'SELECT * from "groups" WHERE id = $1 AND owner = $2',
      values: [groupId, userId]
    }

    const groupToDelete = await clientConnected
      .then(() => client.query(ownershipQuery))
      .then(results => results.rows[0])

    if (!groupToDelete) {
      throw new Error('This ios not the group you are looking for...');
    }


    // DELETE ENTITIES
    const deleteFightsQuery = {
      text: `
          DELETE
          from fights
          WHERE "group" = $1;
      `,
      values: [groupId]
    }

    const deleteFightsOperation = await clientConnected
      .then(() => client.query(deleteFightsQuery));

// DELETE ENTITIES
    const deleteLeagueBotsQuery = {
      text: `
          DELETE
          from league_bots
          WHERE "group" = $1;

      `,
      values: [groupId]
    }

    const deleteLeagueBotsOperation = await clientConnected
      .then(() => client.query(deleteLeagueBotsQuery));

    // DELETE ENTITIES
    const deleteBotsQuery = {
      text: `
          DELETE
          from bots
          WHERE "group" = $1;

      `,
      values: [groupId]
    }

    const deleteBotsOperation = await clientConnected
      .then(() => client.query(deleteBotsQuery));

    // DELETE ENTITIES
    const deleteGroupsUsersQuery = {
      text: `
          DELETE
          from groups_users
          WHERE "group_id" = $1;

      `,
      values: [groupId]
    }

    const deleteGroupsUsersOperation = await clientConnected
      .then(() => client.query(deleteGroupsUsersQuery));

// DELETE ENTITIES
    const deleteGroupsQuery = {
      text: `
          DELETE
          from groups
          WHERE "id" = $1;
      `,
      values: [groupId]
    }

    const deleteGroupsOperation = await clientConnected
      .then(() => client.query(deleteGroupsQuery));

    return {}

  }


}
