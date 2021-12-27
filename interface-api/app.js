const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser");


let Config = require('./src/helpers/configuration');
Config.folder = 'config';
const config = Config.get.bind(Config);


mongoose.connect(config('database.host'), {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("open", () => {
    console.log("Connexion MongoDB reussie")
});


const app = express();
const port = config('app.port');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



app.get('/', async (req, res) => {
    res.status(200).send(true);
});

app.use('/api/v0', require('./routes/v0'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
