const router = require('express').Router();
const locationsDb = require('../db/locations');
const { getLatLngByAddress } = require('../utils/geo-lookup');

const defaultRangeInMiles = 10;

const { body, query, param, validationResult } = require('express-validator');


// Fetch all locations. If lat/long provided will attempt a lookup of locations that are near the provided geolocation.
// if name is provided, do a partial lookup based on name
router.get('/', [query('latitude').optional().isNumeric().withMessage('Only numbers allowed for lat/long'),
    query('longitude').optional().isNumeric().withMessage('Only numbers allowed for lat/long'),
    query('zipcode').optional().isNumeric().withMessage('Only numbers allowed for zipcode'),
    query('rangeMiles').optional().isNumeric().withMessage('Only numbers allowed for rangeMiles'),
    query('name').optional().isString()], async function(req, res) {
    try {  
        // Finds the validation errors in this request and wraps them in an object 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let homeLatitude = req.query.latitude;
        let homeLongitude = req.query.longitude;
        const homeRangeInMiles = req.query.rangeMiles ? req.query.rangeMiles : defaultRangeInMiles;


        let locationName = req.query.name;
        // if a name is provided do a lookup based on that, or...
        if(locationName) {
            console.log(locationName);
            let locations = await locationsDb.getLocationsByName(locationName);
            res.json(locations);
        } // if lat/long provided use that to do a geolookup
        else if (homeLatitude && homeLongitude) {
            let locations = await locationsDb.getLocationsCloseToGeo(homeLatitude, homeLongitude, homeRangeInMiles);
            res.json(locations);
        } else if(req.query.zipcode) {
            // if zip provided, find the coords of that zip and use that
            const geoLocation = await getLatLngByAddress(req.query.zipcode);
            if(geoLocation){
                homeLatitude = geoLocation.latitude;
                homeLongitude = geoLocation.longitude;
            }
            let locations = await locationsDb.getLocationsCloseToGeo(homeLatitude, homeLongitude, homeRangeInMiles);
            res.json(locations);
        } else {
            // otherwise just return all with no geo search
            let locations = await locationsDb.getAllLocations();
            res.json(locations);
        }
    } catch (error) {
        let errorString = `ERROR OCCURRED LOOKING UP LOCATIONS! error: ${error}`;
        console.log(errorString);
        let errorObj = {error: errorString};
        res.status(500).send(errorObj);
    }
});

// Create locations
router.post('/',
    body('name').isLength({ min: 2 }),
    body('bookinglink').isURL(),
    body('address').isLength({ min: 5 }),
    body('serves').isLength({ min: 1 }),
    body('siteinstructions').isLength({ min: 5 }),
    body('county').isLength({ min: 2 }),
    async function(req, res) {
        // Finds the validation errors in this request and wraps them in an object 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const locationToCreate = req.body;

            // go fetch the geo coords of the location to push into the DB
            const geoLocation = await getLatLngByAddress(locationToCreate.address);
            if (geoLocation){
                locationToCreate.latitude = geoLocation.latitude;
                locationToCreate.longitude = geoLocation.longitude;
            }

            let createdLocation = await locationsDb.createLocation(req.body);
            res.status(201).json(createdLocation);
        } catch (error) {
            let errorString = `ERROR OCCURRED CREATING LOCATION! body: ${req.body} error: ${error}`;
            console.log(errorString);
            let errorObj = {error: errorString};
            res.status(500).send(errorObj);
        }
    });

// Update locations
router.put('/:locationId',
    param('locationId').isNumeric(),
    body('name').optional().isLength({ min: 2 }),
    body('bookinglink').optional().isURL(),
    body('address').optional().isLength({ min: 10 }),
    body('serves').optional().isLength({ min: 1 }),
    body('siteinstructions').optional().isLength({ min: 5 }),
    body('county').optional().isLength({ min: 2 }),
    async function(req, res) {
        // Finds the validation errors in this request and wraps them in an object 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {

            let locationToUpdate = req.body;
            // if address is being updated, then lets refetch the coords
            if (locationToUpdate.address){
            // go fetch the geo coords of the location to push into the DB
                const geoLocation = await getLatLngByAddress(locationToUpdate.address);
                if(geoLocation){
                    locationToUpdate.latitude = geoLocation.latitude;
                    locationToUpdate.longitude = geoLocation.longitude;
                }
            }

            let updatedLocation = await locationsDb.updateLocation(req.params.locationId, req.body);
            res.status(200).json(updatedLocation);
        } catch (error) {

            console.log(`ERROR OCCURRED UPDATING LOCATION! locationId: ${req.params.locationId} body: ${req.body} error: ${error}`);
            let errorString = `ERROR OCCURRED UPDATING LOCATION! error: ${error}`;
            let errorObj = {error: errorString};
            res.status(500).send(errorObj);
        }
    });

// Update location availability
router.put('/:locationId/availability',
    param('locationId').isNumeric(),
    body('doses').isNumeric(),
    body('availabilitytime').isDate({format: 'MM-DD-YYYY'}),
    async function(req, res) {
        // Finds the validation errors in this request and wraps them in an object 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let updatedLocation = await locationsDb.insertLocationAvailability(req.params.locationId, req.body);
            res.status(200).json(updatedLocation);
        } catch (error) {
            console.log(`ERROR OCCURRED ADDING LOCATION AVAILABILITY! locationId: ${req.params.locationId} body: ${req.body} error: ${error}`);
            let errorString = `ERROR OCCURRED ADDING LOCATION AVAILABILITY! error: ${error}`;
            let errorObj = {error: errorString};
            res.status(500).send(errorObj);
        }
    });


// delete location availability for a location
router.delete('/:locationId/availability/:locationAvailabilityId',
    param('locationId').isNumeric(),
    param('locationAvailabilityId').isNumeric(),
    async function(req, res) {
        try {
            await locationsDb.deleteLocationAvailability(req.params.locationId, req.params.locationAvailabilityId);
            res.status(200).json('deleted');
        } catch (error) {
            console.log(`ERROR OCCURRED DELETING LOCATION AVAILABILITY! locationId: ${req.params.locationId} locationAvailabilityId: ${req.params.locationAvailabilityId} error: ${error}`);
            let errorString = `ERROR OCCURRED DELETING LOCATION AVAILABILITY! error: ${error}`;
            let errorObj = {error: errorString};
            res.status(500).send(errorObj);
        }
    });

// delete locations
router.delete('/:locationId', 
    param('locationId').isNumeric(),
    async function(req, res) {
        try {
            await locationsDb.deleteLocation(req.params.locationId);
            res.status(200).send('deleted');
        } catch (error) {
            console.log(`ERROR OCCURRED DELETING LOCATION! locationId: ${req.params.locationId} error: ${error}`);
            let errorObj = {error};
            res.status(500).send(errorObj);
        }
    });

module.exports = router;