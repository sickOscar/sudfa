const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');

const GameLauncher = require('./engine/game-launcher')

app.use(bodyParser.json());
app.use(cors())

app-get('/', (req, res) => {    
    res.send('OK');
})

app.post('/source', (req, res)  => {
    
    console.log(req.body)

    let code = req.body.source;
    code = code.replace('/n', '');
    code = code.replace('/r', '');
    console.log(code)

    const gameHistory = GameLauncher.launch({
        source: code
    })


    res.json(gameHistory)
})

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`)
})