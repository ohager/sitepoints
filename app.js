var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sitepointsContext = require('./contexts/sitepoint-context');
var auth = require('./common/auth');

var sitepointApi = require('./routes/restapi/sitepoint-api');
var siteApi = require('./routes/restapi/site-api');
var userApi = require('./routes/restapi/user-api');
var dashboardApi = require('./routes/restapi/dashboard-api');

var viewIndex = require('./views/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth.initialize());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
    req.sitepointsContext = sitepointsContext;
    next();
});

// REST API routing
app.use('/restapi/dashboard', dashboardApi);
app.use('/restapi/user', userApi);
app.use('/restapi/site', siteApi);
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

module.exports = app;
