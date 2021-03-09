const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.DB_CRED_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_CRED_PW,
    port: process.env.DB_PORT,
});


/**
* Create volunteer
**/
const createVolunteer = async (volunteer) => {
    try {
        const { rows } = await pool.query('INSERT INTO volunteers (email, firstName, lastName, role) VALUES ($1, $2, $3, $4)', [volunteer.email, volunteer.firstName, volunteer.lastName, volunteer.role]);
        return rows;
    } catch (error) {
        console.error(`an error occurred when creating a new volunteer ${volunteer}`, volunteer);
        throw new Error(`An unexpected error occurred creating a new volunteer error: ${error}`);
    }
};

/**
* Update volunteer email
**/
const updatedEmail = async (id, newEmail) => {
    try {
        const { rows } = await pool.query('UPDATE volunteers SET email = $2 WHERE id = $1', [id, newEmail]);
        return rows;
    } catch (error) {
        console.error(`an error occurred when updating a volunteer's email ${id}, ${newEmail}`);
        throw new Error(`An unexpected error occurred updating a volunteer's email error: ${error}`);
    }
};

/**
* Get all volunteers
**/
const getAllVolunteers = async () => {
    try {
        const { rows } = await pool.query('SELECT * FROM volunteers');
        return rows;
    } catch (error) {
        console.error('an error occurred when getting all volunteers');
        throw new Error(`An unexpected error occurred updating a volunteer's email error: ${error}`);
    }
};

/**
* Get all volunteers
**/
const getVolunteerByEmail = async (email) => {
    try {
        const { rows } = await pool.query('SELECT * FROM volunteers WHERE email = $1', [email]);
        return rows;
    } catch (error) {
        console.error('an error occurred when getting volunteers by email');
        throw new Error(`An unexpected error fetching by a volunteer's email error: ${error}`);
    }
};

/**
* Delete volunteers
**/
const deleteVolunteer = async (volunteerId) => {
    try {
        const { rows } = await pool.query('DELETE FROM volunteers WHERE id = $1', [volunteerId]);
        return rows;
        // todo delete associated volunteer locations
    } catch (error) {
        console.error(`an error occurred when updating a volunteer ${volunteerId}`, volunteerId);
        throw new Error(`An unexpected error occurred updating a volunteerId error: ${error}`);
    }
};

/**
* Create volunteer to location mapping
**/
const createVolunteerMapping = async (volunteerId, locationId) => {
    try {
        const { rows } = await pool.query('INSERT INTO volunteerLocations (volunteer_id, location_id) VALUES ($1, $2)', [volunteerId, locationId]);
        return rows;
    } catch (error) {
        console.error(`an error occurred when creating a new volunteer mapping ${volunteerId} - ${locationId}`, volunteerId, locationId);
        throw new Error(`An unexpected error occurred creating a new volunteer: ${error}`);
    }
};

/**
* Get all locations a volunteer is responsible for
**/
const getVolunteerLocations = async (volunteerId) => {
    try {
        const query = 'SELECT l.*, ' +
    ' COALESCE(json_agg(la) FILTER (WHERE la.id IS NOT NULL), \'{}\') as availability' +
    ' FROM volunteers v ' +
    ' INNER JOIN volunteerLocations vL ON vL.volunteer_id = v.id ' +
    ' INNER JOIN locations l ON l.id = vL.location_id ' +
    ' LEFT JOIN location_availability la ON la.location_id = l.id ' +
    ' WHERE v.id = $1 ' +
    ' GROUP BY l.id ' +
    ' ORDER BY l.name desc ';
        const { rows } = await pool.query(query, [volunteerId]);
        return rows;
    } catch (error) {
        console.error('an error occurred fetching locations ', error);
        throw new Error('an unexpected error occurred reading from locations DB');
    }
};

/**
* Delete a volunteer to location mapping
**/
const deleteVolunteerLocationMapping = async (volunteerId, locationId) => {
    try {
        const { rows } = await pool.query('DELETE FROM volunteerLocations WHERE volunteer_id = $1 AND location_id = $2', [volunteerId, locationId]);
        return rows;
    } catch (error) {
        console.error(`an error occurred when updating a volunteer mapping ${volunteerId}`, volunteerId);
        throw new Error(`An unexpected error occurred updating a volunteer mapping error: ${error}`);
    }
};

module.exports = {
    createVolunteer,
    updatedEmail,
    getAllVolunteers,
    getVolunteerByEmail,
    deleteVolunteer,
    createVolunteerMapping,
    getVolunteerLocations,
    deleteVolunteerLocationMapping
};