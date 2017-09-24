const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const seeder = require('./seeder');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const authentication = require('./authentication');
const mongodb = require('./mongodb');
const Raven = require('raven');
const logger = require('winston');

const app = feathers();

// Load app configuration
app.configure(configuration(path.join(__dirname, '..')));

if (app.get('sentry').dns !== undefined && app.get('sentry').dns !== 'SENTRY_DNS') {
  // LOGGING IS ENABLED
  logger.log('SENTRY LOGGING IS ENABLED');

  // Must configure Raven before doing anything else with it
  Raven.config(app.get('sentry').dns, app.get('sentry').options).install();

  // The request handler must be the first middleware on the app
  app.use(Raven.requestHandler());
  // The error handler must be before any other error middleware
  app.use(Raven.errorHandler());
  // Optional fallthrough error handler
  app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    logger.log('next:' + next);
    res.statusCode = 500;
    res.end(res.sentry + '\n');
  });
}



// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', feathers.static(app.get('public')));


// Set up Plugins and providers
app.configure(hooks());
app.configure(mongodb);
app.configure(rest());

app.configure(socketio());

// Configure Database Seeder
app.configure(seeder());

app.configure(authentication);

// Set up our services (see `services/index.js`)
app.configure(services);
// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);
app.hooks(appHooks);

// Set debug mode while in development
if(process.env.NODE_ENV === 'development') {
  app.set('debug', true);
}




module.exports = app;
