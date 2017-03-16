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
app.set('view engine', 'ejs');

// Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Routs
app.get('/', function(req, res) {
    var title = 'Redis TodoList';

    client.lrange('todos', 0, -1, function(err, reply) {
        if (err) {
            res.send(err);
        }

        res.render('index', {
            title: title,
            todos: reply
        });
    });
});

app.post('/todo/add', function(req, res, next) {
    var todo = req.body.todo;
    client.rpush('todos', todo, function(err, reply) {
        if (err) {
            res.send(err);
        }

        console.log('Todo Added');
        res.redirect('/');
    });
});

app.post('/todo/delete', function(req, res, next) {
    var delTodos = req.body.todos;

    client.lrange('todos', 0, -1, function(err, todos) {
        for (var i = 0; i < todos.length; i++) {
            if (delTodos.indexOf(todos[i]) > -1) {
                client.lrem('todos', 0, todos[i], function() {
                    if (err) {
                        console.log();
                    }
                });
            }
        }

        res.redirect('/');
    });
});


app.listen(3000, function() {
    console.log('Server starded on localhost:3000');
});

module.exports = app;