const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const users = require('./routers/user.router');
dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());
app.use('/signup', users )
app.listen(8080);
mongoose.connect('mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/'+ process.env.DB_NAME , {useNewUrlParser: true});
module.exports = app;