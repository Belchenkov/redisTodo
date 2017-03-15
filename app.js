var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var redis = require('redis');

var app = express();

// Redis Client
var client = redis.createClient();

client.on('connect', function() {
    console.log('Connected To Redis ...');
});


// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view_engine', 'ejs');

// Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Routs
app.get('/', function(req, res) {
    res.send('<h2>HOME</h2>');
});

app.listen(3000, function() {
    console.log('Server starded on localhost:3000');
});

module.exports = app;