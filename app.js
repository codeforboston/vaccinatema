// Include the cluster module
var cluster = require('cluster');
var fs = require('fs');
require('dotenv').config()

var distanceUtils = require('./utils/distance-utils');

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
    var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('applrO42eyJ3rUQyb');
    var sites = []
    var sites_latitude = []
    var sites_longitude = []
    var available = []
    var available_latitude = []
    var available_longitude = []
    function saveState() {
        sites = []
        available = []
        base('MaVaccSites_Today').select({
            // Selecting the first 3 records in Grid view:
            view: "Default all site view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
            records.forEach(function(record) {
                //console.log('Retrieved', record.get('Location Name'));
                sites.push(record);
                sites_longitude.push(record.get('Longitude'));
                sites_latitude.push(record.get('Latitude'));
                if(!(record.get("Availability") === "None")) {
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

    saveState();

    var AWS = require('aws-sdk');
    var express = require('express');
    var bodyParser = require('body-parser');

    AWS.config.region = process.env.REGION

    var sns = new AWS.SNS();
    var ddb = new AWS.DynamoDB();

    var ddbTable =  process.env.STARTUP_SIGNUP_TABLE;
    var snsTopic =  process.env.NEW_SIGNUP_TOPIC;
    var app = express();

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use(bodyParser.urlencoded({extended:false}));

    app.get('/', function(req, res) {
        res.render('index', {
            static_path: '',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.get('/search', function(req, res) {
        res.render('search', {
            static_path: '',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.get('/eligibility', function(req, res) {
        res.render('eligibility', {
            static_path: '',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.get('/FAQ', function(req, res) {
        res.render('FAQ', {
            static_path: '',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.get('/sites', function(req, res) {
        res.render('sites', {
            static_path: '',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.get('/initmap', function(req, res) {
        res.send(sites);
    });

    app.use(express.static('static'));

    app.post('/search_query', function(req, res) {
        console.log(req.body);
        var item = {
            'zip-code': {'S': req.body.zipCode},
            'site-type': {'S': req.body.siteType},
        };

        
        console.log(req.body.zipCode);
        ddb.putItem({
            'TableName': ddbTable,
            'Item': item,
            'Expected': { email: { Exists: false } }        
        }, function(err, data) {
            if (err) {
                var returnStatus = 500;

                if (err.code === 'ConditionalCheckFailedException') {
                    returnStatus = 409;
                }

                res.status(returnStatus).end();
                console.log('DDB Error: ' + err);
            } else {
                sns.publish({
                    'Message': 'Name: ' + req.body.name + "\r\nEmail: " + req.body.email 
                                        + "\r\nPreviewAccess: " + req.body.previewAccess 
                                        + "\r\nTheme: " + req.body.theme,
                    'Subject': 'New user sign up!!!',
                    'TopicArn': snsTopic
                }, function(err, data) {
                    if (err) {
                        res.status(500).end();
                        console.log('SNS Error: ' + err);
                    } else {
                        res.status(201).end();
                    }
                });            
            }
        });
    });

    app.post('/search_query_location', function (req, res) {
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

    // Start the server.
    var port = process.env.PORT || 3002;
    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}
