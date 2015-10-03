var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sitepointsContext = require('./contexts/sitepoint-context');

var sitepointApi = require('./routes/restapi/sitepoint-api');
var accountApi = require('./routes/restapi/account-api');
var loginApi = require('./routes/restapi/auth-api');


var viewIndex = require('./views/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
    res.header("Access-Control-Expose-Headers", "X-Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
    req.sitepointsContext = sitepointsContext;
    next();
});

// REST API routing
app.use('/restapi/auth', loginApi);
app.use('/restapi/account', accountApi);
app.use('/restapi/sitepoint', sitepointApi);

// VIEW routing
app.use('/', viewIndex);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500).send(err.message);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
});

process.on('uncaughtException', function(err){
    console.log(err);
});

//var key = apikey.create({user:'admin'});
//console.info(key);

module.exports = app;
