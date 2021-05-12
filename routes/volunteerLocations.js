const router = require('express').Router();
const volunteersDb = require('../db/volunteers');
const {body, query, validationResult} = require('express-validator');

// Create location to volunteer mapping
router.post(
    '/',
    body('volunteerId').isNumeric({min: 1}),
    body('locationId').isNumeric({min: 1}),
    async function (req, res) {
        // Finds the validation errors in this request and wraps them in an object
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const volunteer = await volunteersDb.createVolunteerMapping(
                req.body.volunteerId,
                req.body.locationId
            );
            res.status(201).json(volunteer);
        } catch (error) {
            let errorString = `ERROR OCCURRED CREATING Volunteer Mapping! body: ${req.body} error: ${error}`;
            console.log(errorString);
            let errorObj = {error: errorString};
            res.status(500).send(errorObj);
        }
    }
);

router.get(
    '/',
    query('volunteerId')
        .isNumeric()
        .withMessage('Numeric volunteer id is required'),
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const volunteerLocations = await volunteersDb.getVolunteerLocations(
                req.query.volunteerId
            );
            res.status(200).json(volunteerLocations);
        } catch (error) {
            let errorString = `ERROR OCCURRED LOOKING UP VOLUNTEER! error: ${error}`;
            console.log(errorString);
            let errorObj = {error: errorString};
            res.status(500).send(errorObj);
        }
    }
);

// Delete volunteer mapping
router.delete(
    '/',
    query('volunteerId')
        .isNumeric()
        .withMessage('Numeric volunteer id is required'),
    query('locationId')
        .isNumeric()
        .withMessage('Numeric location id is required'),
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const volunteers =
                await volunteersDb.deleteVolunteerLocationMapping(
                    req.query.volunteerId,
                    req.query.locationId
                );
            res.status(200).json(volunteers);
        } catch (error) {
            let errorString = `ERROR OCCURRED DELETING UP MAPPING! error: ${error}`;
            console.log(errorString);
            let errorObj = {error: errorString};
            res.status(500).send(errorObj);
        }
    }
);

module.exports = router;
