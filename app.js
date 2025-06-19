const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swaggerConfig.js');
const swaggerJsdoc = require("swagger-jsdoc");
const http = require('http');

const indexRoute = require('./routes/indexRoute');
const healthRouter = require('./routes/healthCheckRoute')
const cardSearchRouter = require('./routes/cardSearchRoute')

const express = require('express');
const cors = require('cors');

const app = express();
const debug = require('debug')('shop-searching-service:server');

//swagger config
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerDocument.swaggerOptions)));

//start server
const PORT = normalizePort(process.env.PORT || '8080');
app.set('port', PORT);
const server = http.createServer(app);

server.listen(PORT);
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

//basic routes
app.use('/', indexRoute);
app.use('/', healthRouter);

//cardSearching
app.use('/', cardSearchRouter);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port;
  debug('Listening on ' + bind);
  console.log(`Server is running on port ${addr.port}`);
}

module.exports = app;
