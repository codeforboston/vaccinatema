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
        const { rows } = await pool.query('INSERT INTO volunteers (email, firstName, lastName) VALUES ($1, $2, $3)', [volunteer.email, volunteer.firstName, volunteer.lastName]);
        return rows;
    } catch (error) {
        console.error(`an error occurred when creating a new volunteer ${volunteer}`, volunteer);
        throw new Error(`An unexpected error occurred creating a new volunteer error: ${error}`);
    }
};

/**
* Upate volunteer email
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

module.exports = {
    createVolunteer,
    updatedEmail,
    getAllVolunteers,
    deleteVolunteer
};