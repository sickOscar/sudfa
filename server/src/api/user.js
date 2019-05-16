const {jwtCheck} = require('./auth');
const User = require('../model/user');


class UserApi {

  constructor(app) {

    app.post('/user', jwtCheck, (req, res) => {
      const authId = req.user.sub

      User.one({
        id: authId
      })
        .then(user => {

          if (!user) {
            User.add(authId)
              .then(response => {
                res.json(response)
              })

          } else {
            res.json(user)
          }
        })
        .catch(error => {
          res.status(500).send(error);
        })

    })

    app.put('/user', jwtCheck, (req, res) => {
      const authId = req.user.sub
      User.one({
          id: authId
        })
        .then(user => {

          if (user) {
            User.update(authId, req.body)
              .then(response => {
                res.json(response)
              })
          } else {
            throw new Error('User not found')
          }
        })
        .catch(error => {
          res.status(500).send(error);
        })

    })

  }

}

module.exports = (function() {

  let instance = null

  const getInstance = function(app) {
    if (!instance) {
      instance = new UserApi(app);
    }
    return instance;
  }

  return {
    getInstance
  }

}())
