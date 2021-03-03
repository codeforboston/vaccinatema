const router = require('express').Router();
const volunteersDb = require('../db/volunteers');
const { body, param, validationResult, query } = require('express-validator');


// Create locations
router.post('/',
    body('email').isLength({ min: 2 }),
    body('firstName').isLength({ min: 1 }),
    body('lastName').isLength({ min: 1 }),
    body('role').isLength({ min: 1 }),
    async function(req, res) {
        // Finds the validation errors in this request and wraps them in an object 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const volunteer = await volunteersDb.createVolunteer(req.body);
            res.status(201).json(volunteer);
        } catch (error) {
            let errorString = `ERROR OCCURRED CREATING Volunteer! body: ${req.body} error: ${error}`;
            console.log(errorString);
            let errorObj = {error: errorString};
            res.status(500).send(errorObj);
        }
    });

// Update volunteer email
// Create locations
router.put('/:volunteerId',
    body('email').isLength({ min: 2 }),
    async function(req, res) {
        // Finds the validation errors in this request and wraps them in an object 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const volunteer = await volunteersDb.updatedEmail(req.params.volunteerId, req.body.email);
            res.status(201).json(volunteer);
        } catch (error) {
            let errorString = `ERROR OCCURRED CREATING Volunteer! body: ${req.body} error: ${error}`;
            console.log(errorString);
            let errorObj = {error: errorString};
            res.status(500).send(errorObj);
        }
    });

// Get all volunteer
router.get('/',
    async function(req, res) {
        try {  
            const volunteers = await volunteersDb.getAllVolunteers();
            res.status(201).json(volunteers);
        } catch (error) {
            let errorString = `ERROR OCCURRED LOOKING UP LOCATIONS! error: ${error}`;
            console.log(errorString);
            let errorObj = {error: errorString};
            res.status(500).send(errorObj);
        }
    });


// Get all volunteer
router.get('/by-email',
    query('volunteerEmail').isEmail(),
    async function(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {  
            const volunteers = await volunteersDb.getVolunteerByEmail(req.query.volunteerEmail);
            res.status(201).json(volunteers);
        } catch (error) {
            let errorString = `ERROR OCCURRED LOOKING UP LOCATIONS! error: ${error}`;
            console.log(errorString);
            let errorObj = {error: errorString};
            res.status(500).send(errorObj);
        }
    });

// Delete volunteer
router.delete('/:volunteerId', param('volunteerId').isNumeric(),
    async function(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {  
            const volunteers = await volunteersDb.deleteVolunteer(req.params.volunteerId);
            res.status(201).json(volunteers);
        } catch (error) {
            let errorString = `ERROR OCCURRED LOOKING UP LOCATIONS! error: ${error}`;
            console.log(errorString);
            let errorObj = {error: errorString};
            res.status(500).send(errorObj);
        }
    });
module.exports = router;