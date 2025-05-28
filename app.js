
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swaggerConfig.js');
const swaggerJsdoc = require("swagger-jsdoc");
var http = require('http');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/userRouter');

var express = require('express');
var cors = require('cors');


var app = express();
var debug = require('debug')('shop-searching-service:server');

//swagger config
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerDocument.swaggerOptions)));

//start server
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Middleware configuration
app.use(express.json());            // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded data
app.use(cors());                    // Enable CORS for cross-origin requests
app.use(cookieParser()); //Parse Cookie header and populate req.cookies with an object keyed by the cookie names. 

//get .env values
require('dotenv').config()
console.log(process.env.S3_BUCKET)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
