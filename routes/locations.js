const router = require('express').Router();
const locationsDb = require('../db/locations');

const defaultRangeInMiles = 10;

const { body, query, validationResult } = require('express-validator');

router.get('/', [query('latitude').optional().isNumeric().withMessage('Only numbers allowed for lat/long'),
                query('longitude').optional().isNumeric().withMessage('Only numbers allowed for lat/long'),
                query('rangeMiles').optional().isNumeric().withMessage('Only numbers allowed for rangeMiles')], async function(req, res) {
    try {  
        // Finds the validation errors in this request and wraps them in an object 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const homeLatitude = req.query.latitude;
        const homeLongitude = req.query.longitude;
        const homeRangeInMiles = req.query.rangeMiles;
        if (homeLatitude && homeLongitude)
        {   
            const range = homeRangeInMiles ? homeRangeInMiles : defaultRangeInMiles;
            let locations = await locationsDb.getLocationsCloseToGeo(homeLatitude, homeLongitude, range);
            res.json(locations);
        } else{
            let locations = await locationsDb.getAllLocations();
            res.json(locations);
        }
    } catch (error) {
        let errorString = `ERROR OCCURRED LOOKING UP LOCATIONS! error: ${error}`;
        console.log(errorString)
        let errorObj = {error: errorString};
        res.status(500).send(errorObj);
    }
});

router.post('/',
    body('name').isLength({ min: 2 }),
    body('bookinglink').isURL(),
    // TODO: what is this format?
    body('address').isLength({ min: 5 }),
    body('serves').isLength({ min: 1 }),
    body('siteinstructions').isLength({ min: 10 }),
    body('county').isLength({ min: 5 }),
    body('latitude').isNumeric(),
    body('longitude').isNumeric(),
 async function(req, res) {
     // Finds the validation errors in this request and wraps them in an object 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        let createdLocation = await locationsDb.createLocation(req.body);
        res.status(201).json(createdLocation);
    } catch (error) {
        let errorString = `ERROR OCCURRED CREATING LOCATION! body: ${req.body} error: ${error}`;
        console.log(errorString)
        let errorObj = {error: errorString};
        res.status(500).send(errorObj);
    }
});

router.put('/:locationId',
    body('name').optional().isLength({ min: 2 }),
    body('bookinglink').optional().isURL(),
    body('address').optional().isLength({ min: 5 }),
    body('serves').optional().isLength({ min: 1 }),
    body('siteinstructions').optional().isLength({ min: 10 }),
    body('county').optional().isLength({ min: 5 }),
    body('latitude').optional().isNumeric(),
    body('longitude').optional().isNumeric(),
 async function(req, res) {
     // Finds the validation errors in this request and wraps them in an object 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        let updatedLocation = await locationsDb.updateLocation(req.params.locationId, req.body);
        res.status(200).json(updatedLocation);
    } catch (error) {

        console.log(`ERROR OCCURRED UPDATING LOCATION! locationId: ${req.params.locationId} body: ${req.body} error: ${error}`)
        let errorString = `ERROR OCCURRED UPDATING LOCATION! error: ${error}`;
        let errorObj = {error: errorString};
        res.status(500).send(errorObj);
    }
});


router.delete('/:locationId', async function(req, res) {
    try {
        await locationsDb.deleteLocation(req.params.locationId);
        res.status(200).send("deleted");
    } catch (error) {
        console.log(`ERROR OCCURRED DELETING LOCATION! locationId: ${req.params.locationId} error: ${error}`)
        let errorObj = {error};
        res.status(500).send(errorObj);
    }
});

module.exports = router;