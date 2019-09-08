const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const GameApi = require('./src/api/game');
const UserApi = require('./src/api/user');
const BotApi = require('./src/api/bot');
const GroupsApi = require('./src/api/groups');

app.use(bodyParser.json());
app.use(cors());

const pg = require('pg');

const { Client } = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

const gameApi = GameApi.getInstance(app);
const userApi = UserApi.getInstance(app);
const botAPi = BotApi.getInstance(app);
const groupsApi = GroupsApi.getInstance(app);

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
});
