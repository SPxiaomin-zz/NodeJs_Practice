var express = require('express');
var parseurl = require('parseurl');
var url = require('url');
var logger = require('morgan');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));


app.use(function(req, res, next) {
    var views = req.session.views;

    if ( !views ) {
        views = req.session.views = {};
    }

    var pathname = parseurl(req).pathname;  // parseurl 模块的就是对 url 模块的包装，只不过 parseurl 对 url 模块进行了优化，采用了 memoization 技术进行缓存
    //var pathname = url.parse(req.url).pathname;  
    console.log('req.url: ' + req.url + '; pathname: ' + pathname);


    views[pathname] = ( views[pathname] || 0 ) + 1;

    next();
});

app.use('/', routes);

app.listen(3000, function(req, res, next) {
    console.log('App Started on Port 3000');
});

