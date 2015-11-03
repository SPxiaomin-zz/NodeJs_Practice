var express = require('express');
var logger = require('morgan');
var flash = require('connect-flash');
var session = require('express-session');

var routes = require('./routes/index.js');

var app = express();

app.use(logger('dev'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use('/', routes);

app.listen(3000, function(req, res, next) {
    console.log('App Started on Port 3000');
});
