require('dotenv').config();
var cluster = require('cluster');

if (process.env.NODE_ENV === 'production') {
    require('newrelic');
    require('@newrelic/aws-sdk');
}

var distanceUtils = require('./utils/distance-utils');
var siteUtils = require('./utils/site-utils');

function saveState() {
    sites = [];
    available = [];
    base('MaVaccSites_Today')
        .select({
            // Selecting the first 3 records in Grid view:
            view: 'Default all site view',
        })
        .eachPage(
            function page(records, fetchNextPage) {
                // This function (`page`) will get called for each page of records.
                records.forEach(function (record) {
                    const data = siteUtils.getDataFromRecord(record);

                    sites.push(data);
                    if (data.availability) {
                        available.push(data);
                    }
                });

                // To fetch the next page of records, call `fetchNextPage`.
                // If there are more records, `page` will get called again.
                // If there are no more records, `done` will get called.
                fetchNextPage();
            },
            function done(err) {
                if (err) {
                    console.error(err);
                    return;
                }
            }
        );
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
        base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(
            'applrO42eyJ3rUQyb'
        );
    } else {
        console.error('AIRTABLE_API_KEY should be set in .env');
    }
    var sites = [];
    var available = [];
    if (process.env.AIRTABLE_API_KEY) {
        saveState();
    }

    var AWS = require('aws-sdk');
    var express = require('express');
    var bodyParser = require('body-parser');
    var next = require('next');

    const dev = process.env.NODE_ENV !== 'production';
    const app = next({dev});
    const handle = app.getRequestHandler();

    AWS.config.region = process.env.REGION;

    app.prepare().then(() => {
        var server = express();

        server.enable('trust proxy');

        server.use(bodyParser.urlencoded({extended: false}));
        server.use(bodyParser.json());

        server.use(function (req, res, next) {
            if (req.secure || process.env.NODE_ENV === 'development') {
                next();
            } else {
                res.redirect('https://' + req.headers.host + req.url);
            }
        });

        server.use('/robots.txt', function (req, res) {
            res.type('text/plain');
            res.send('User-agent: *\nAllow: /');
        });

        server.get('/initmap', function (req, res) {
            res.send(sites);
        });

        server.get('/volunteer:/volunteer/updater', (req, res) => {
            return app.render(req, res, '/volunteer', req.query);
        });

        server.use(express.static('static'));

        server.post('/search_query_location', async function (req, res) {
            var locations = [];
            if (req.body.availability === 'Sites with reported doses') {
                locations = available;
            } else {
                locations = sites;
            }

            try {
                const {lat, lng} = await distanceUtils.getLatLngFromRequest(
                    req
                );
                const siteData = distanceUtils.getClosestLocations(
                    locations,
                    lat,
                    lng,
                    req.body.maxMiles
                );
                res.send({siteData, lat, lng});
            } catch (exception) {
                console.error('Failed to geocode', exception);
                res.status(500).send('Failed geocoding request.');
            }
        });

        // THE API ROUTES WE HAVE DEFINED NEED TO BE ADDED HERE:
        const locationApi = require('./routes/locations');
        server.use('/locations', locationApi);

        const volunteersApi = require('./routes/volunteers');
        server.use('/volunteers', volunteersApi);

        const volunteersLocationsApi = require('./routes/volunteerLocations');
        server.use('/volunteers-locations', volunteersLocationsApi);

        /**
         * Next.js (React) pages defined in the /pages folder will automatically be routed
         * without the need to define each route in this Nodejs file.
         */
        server.all('*', handle);

        // Start the server.
        var port = process.env.PORT || 3002;
        server.listen(port, function () {
            console.log('Server running at http://127.0.0.1:' + port + '/');
        });
    });
}
