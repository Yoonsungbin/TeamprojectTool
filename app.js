var express = require('express')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
//socket network
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);
// mongodb
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/mango');

app.get('/', function (req, res) {
        fs.readFile('index.html', function (error, data){
        res.writeHead(200, { 'Content-Type':'text/html' });
        res.end(data);
        });
});
//console.log('connect?');
io.on('connection', function(socket){
  // console.log('user login');
   console.log('a user connected');
   socket.broadcast.emit('hi');
  // console.log('chat message start');
   socket.on('getmessage', function(msg){
 //  console.log('message: ' + msg);
  io.emit('putmessage', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


app.get('/main', function (req, res) {
        fs.readFile('main.html', function (error, data){
        res.writeHead(200, { 'Content-Type':'text/html' });
        res.end(data);
        });
});

//app.get('/user',function (req,res) {
//        res.render('index', { title:'Express'});
//});
//mobile add
//app.get('/add', function (req, res) {
//        fs.readFile('add.html', function (error, data){
//        res.writeHead(200, { 'Content-Type':'text/html' });
//        res.end(data);
//        });
//});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//file path setting
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    req.db = db;
    next();
});


//chatting
app.use('/', routes);
app.use('/users', users);
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
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
//server activite
http.listen(8080,function() {
        console.log('server 8080');
});

module.exports = app;
