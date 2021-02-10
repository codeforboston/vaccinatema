// Include the cluster module
var cluster = require('cluster');
var fs = require('fs');
require('dotenv').config()
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
    app.use(bodyParser.json());

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
    
    function degrees_to_radians(degrees)
    {
        var pi = Math.PI;
        return degrees * (pi/180);
    }
    function distance(record,pos_lat,pos_long){
        var lat1=parseFloat(record.get("Latitude"));
        var lat2=parseFloat(pos_lat);
        var lon1=parseFloat(record.get("Longitude"));
        var lon2=parseFloat(pos_long);
        var R = 6371000; // metres
        var φ1 = degrees_to_radians(lat1);
        var φ2 = degrees_to_radians(lat2);
        var Δφ = degrees_to_radians((lat2-lat1));
        var Δλ = degrees_to_radians((lon2-lon1));

        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        var d = R * c;
        return d;
    }


    app.post('/search_query_location', function(req, res) {
        console.log(req.body.latitude);
        console.log(req.body.longitude);
        console.log(req.body.availability);
        var locations = [];
        if (req.body.availability === "Sites with reported doses") {
            locations = available;
        }
        else {
            locations = sites;           
        }
        console.log("location 0 " + locations[0].get("Location Name"));
        console.log("location 1" + locations[1]);
        var distance_array = []
        
        for(var i=0;i<locations.length;i++){
            distance_array[i] = distance(locations[i],req.body.latitude,req.body.longitude);
        }

        function findIndicesOfMax(inp, count) {
            var outp = [];
            for (var i = 0; i < inp.length; i++) {
                outp.push(i); // add index to output array
                if (outp.length > count) {
                    outp.sort(function(a, b) { return inp[a] - inp[b]; }); // descending sort the output array
                    outp.pop(); // remove the last index (index of smallest element in output array)
                }
            }
            var closest = []
            outp.forEach(function(element) {
                closest.push(locations[element])
            })
            return closest;
        }

        var indices = findIndicesOfMax(distance_array, 5);
        

        res.send(indices);
    });



    // THE API ROUTES WE HAVE DEFINED NEED TO BE ADDED HERE:
    const locationApi = require('./routes/locations');
    app.use('/locations', locationApi);


    var port = process.env.PORT || 3002;

    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}