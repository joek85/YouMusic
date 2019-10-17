var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var index = require('./routes/index');
//var media = require('./routes/media');
var users = require('./routes/users');
var history = require('./routes/history');
var library = require('./routes/library');
var search = require('./routes/search');
var player = require('./routes/player');
var channel = require('./routes/channel');
var playlist = require('./routes/playlist');
var sets = require('./routes/sets');
var download = require('./routes/download');
var offline = require('./routes/offline');
var cors = require('cors');
var app = express();

var corsOptions = {
    origin: 'https://localhost:4433',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
 //app.use(cors(corsOptions));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
//     next();
// });
app.use(function(req,res,next){
    var _send = res.send;
    var sent = false;
    res.send = function(data){
        if(sent) return;
        _send.bind(res)(data);
        sent = true;
    };
    next();
});
app.use(function(req, res, next){
    req.setTimeout(0); // no timeout for all requests, your server will be DoS'd
    next()
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'media')));
app.use('/medias', express.static(__dirname + '/media'));
app.use('/', index);
//app.use('/medias', media);
app.use('/users', users);
app.use('/history', history);
app.use('/library', library);
app.use('/search', search);
app.use('/player', player);
app.use('/channel',channel);
app.use('/playlist',playlist);
app.use('/sets',sets);
app.use('/download',download);
app.use('/offline',offline);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

global.pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'pizza',
    database : 'musiclab',
    connectionLimit: '100'
});


// connection.connect(function(err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
//
//     console.log('connected as id ' + connection.threadId);
//
// });

module.exports = app;
