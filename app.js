require('dotenv').config();
require('newrelic');
require('@newrelic/aws-sdk');
var cluster = require('cluster');

var distanceUtils = require('./utils/distance-utils');

function saveState() {
  sites = [];
  available = [];
  base('MaVaccSites_Today').select({
    // Selecting the first 3 records in Grid view:
    view: 'Default all site view'
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function(record) {
      sites.push(record);
      sites_longitude.push(record.get('Longitude'));
      sites_latitude.push(record.get('Latitude'));
      if(!(record.get('Availability') === 'None')) {
        available.push(record);
        available_longitude.push(record.get('Longitude'));
        available_latitude.push(record.get('Latitude'));
      }

    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

  }, function done(err) {
    if (err) { console.error(err); return; }
  });
  setTimeout(saveState, 60000);
}

// Code to run if we're in the master process
if (cluster.isMaster) {

  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // Listen for terminating workers
  cluster.on('exit', function (worker) {

    // Replace the terminated workers
    console.log('Worker ' + worker.id + ' died :(');
    cluster.fork();

  });

// Code to run if we're in a worker process
} else {
  var Airtable = require('airtable');
  var base;
  if (process.env.AIRTABLE_API_KEY) {
    base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('applrO42eyJ3rUQyb');
  } else {
    console.error('AIRTABLE_API_KEY should be set in .env');
  }
  var sites = [];
  var sites_latitude = [];
  var sites_longitude = [];
  var available = [];
  var available_latitude = [];
  var available_longitude = [];
  if (process.env.AIRTABLE_API_KEY) {
    saveState();
  }

  var AWS = require('aws-sdk');
  var express = require('express');
  var bodyParser = require('body-parser');
  var next = require('next');

  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev });

  AWS.config.region = process.env.REGION;

  app.prepare().then(() => {
    var server = express();

    server.set('view engine', 'ejs');
    server.set('views', __dirname + '/views');
    server.use(bodyParser.urlencoded({extended:false}));
    server.use(bodyParser.json());

    server.use('/robots.txt', function (req, res) {
      res.type('text/plain');
      res.send('User-agent: *\nAllow: /');
    });

    server.get('/', function(req, res) {
      res.render('index', {
        static_path: '',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false'
      });
    });

    server.get('/search', function(req, res) {
      res.render('search', {
        static_path: '',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false'
      });
    });

    server.get('/eligibility', function(req, res) {
      res.render('eligibility', {
        static_path: '',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false'
      });
    });

    server.get('/FAQ', function(req, res) {
      res.render('FAQ', {
        static_path: '',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false'
      });
    });

    server.get('/sites', function(req, res) {
      res.render('sites', {
        static_path: '',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false'
      });
    });

    server.get('/initmap', function(req, res) {
      res.send(sites);
    });

    // NOTE: These routes are for the development of the new react front end
    // It will be moved off of dev to the root when complete
    server.get('/dev', (req, res) => {
      return app.render(req, res, '/dev', req.query);
    });

    server.get('/dev/eligibility', (req, res) => {
      return app.render(req, res, '/dev/eligibility', req.query);
    });

    server.get('/dev/press', (req, res) => {
      return app.render(req, res, '/dev/press', req.query);
    });

    server.get('/dev/FAQ', (req, res) => {
      return app.render(req, res, '/dev/FAQ', req.query);
    });

    server.get('/dev/search', (req, res) => {
      return app.render(req, res, '/dev/search', req.query);
    });

    server.use(express.static('static'));

    server.post('/search_query_location', function (req, res) {
      var locations = [];
      if (req.body.availability === 'Sites with reported doses') {
        locations = available;
      } else {
        locations = sites;
      }

      var closest = distanceUtils.getClosestLocations(
        locations,
        5,
        req.body.latitude,
        req.body.longitude
      );
      res.send(closest);
    });

    // THE API ROUTES WE HAVE DEFINED NEED TO BE ADDED HERE:
    const locationApi = require('./routes/locations');
    server.use('/locations', locationApi);

    // Start the server.
    var port = process.env.PORT || 3002;
    server.listen(port, function () {
      console.log('Server running at http://127.0.0.1:' + port + '/');
    });
  });
}
