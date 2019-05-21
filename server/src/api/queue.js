const GameLauncher = require('../engine/game-launcher');
const {jwtCheck} = require('./auth');
const GameArena = require('../engine/game-arena');
const Bot = require('../model/bot');
const League = require('../model/league');
const Fight = require('../model/fight');
const fs = require('fs');

class QueueApi {

  constructor(app) {


    /**
     *
     */
    app.post('/queue', (req, res) => {



    })

  }

}

module.exports = (function () {

  let instance = null

  const getInstance = function (app) {
    if (!instance) {
      instance = new QueueApi(app);
    }
    return instance;
  }

  return {
    getInstance
  }

}())
