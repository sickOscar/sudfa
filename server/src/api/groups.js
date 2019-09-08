const Groups = require('../model/group');
const {jwtCheck} = require('./auth');

class GroupsApi {

  constructor(app) {

    app.get('/my-groups', jwtCheck, (req, res) => {
      const userId = req.user.sub;
      // get groups
      Groups.userGroups(userId)
        .then(res.json)
        .catch(error => {
          res.sendStatus(500);
          res.send(error);
        })
    });

    app.post('/groups', jwtCheck, (req, res) => {
      // create group
      const userId = req.user.sub;
      const groupModel = {
        ...req.body,
        owner: userId
      };
      Groups.add(groupModel)
        .then(res.json)
        .catch(error => {
          res.sendStatus(500);
          res.send(error);
        })
    });

    app.post('/groups/user-join/:groupId', jwtCheck, (req, res) => {
      // join user to group
      const userId = req.user.sub;
      Groups.addUserToGroup(req.params.groupId, userId)
        .then(res.json)
        .catch(error => {
          res.sendStatus(500);
          res.send(error);
        })
    });

    app.post('/groups/bot-join/:groupId/:botId', (req, res) => {
      const userId = req.user.sub;
      Groups.addBotToGroup(req.params.groupId, req.params.botId)
        .then(res.json)
        .catch(error => {
          res.sendStatus(500);
          res.send(error);
        })
    })

  }

}

module.exports = (function () {

  let instance = null;

  const getInstance = function (app) {
    if (!instance) {
      instance = new GroupsApi(app);
    }
    return instance;
  };

  return {
    getInstance
  }

}());
