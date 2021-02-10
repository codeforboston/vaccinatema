const router = require('express').Router();
const locationsDb = require('../db/locations');

const { body, validationResult } = require('express-validator');

router.get('/', async function(req, res) {
    try {  
        let locations = await locationsDb.getAllLocations();
        res.json(locations);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/',
    body('name').isLength({ min: 2 }),
    body('bookingLink').isURL(),
    // TODO: what is this format?
    body('address').isLength({ min: 5 }),
    body('serves').isLength({ min: 1 }),
    body('siteInstructions').isLength({ min: 10 }),
    // TODO: what is this format?
    body('daysOpen').isLength({ min: 1 }),
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
        res.json(createdLocation);
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;