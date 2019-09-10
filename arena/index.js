const app = require('express')();
const bodyParser = require('body-parser');
require('dotenv').config();

const GameLauncher = require('./src/engine/game-launcher');

app.use(bodyParser.json());


app.post('/bot', (req, res) => {

  GameLauncher.launch(req.body.player, req.body.bot)
    .then(gameResults => {
      res.json(gameResults)
    })
    .catch(error => {
      console.error("Arena Error", error);
      res.sendStatus(500)
    })

})

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})
