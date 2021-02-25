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
const createVolunteer = async (email, firstName, lastName) => {
    try {
        const { rows } = await pool.query('INSERT INTO volunteers (email, firstName, lastName) VALUES ($1, $2, $3)', [email, firstName, lastName]);
        return rows.length > 0;
    } catch (error) {
        console.error(`an error occurred when creating a new volunteer ${email}`, email);
        throw new Error(`An unexpected error occurred creating a new volunteer error: ${error}`);
    }
};

/**
* Upate volunteer email
**/
const updatedEmail = async (email, newEmail) => {
    try {
        const { rows } = await pool.query('UPDATE volunteers (email) VALUES ($2) WHERE email = $1)', [email, newEmail]);
        return rows.length > 0;
    } catch (error) {
        console.error(`an error occurred when updating a volunteer's email ${email}`, email);
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
        console.error(`an error occurred when updating a volunteer's email ${email}`, email);
        throw new Error(`An unexpected error occurred updating a volunteer's email error: ${error}`);
    }
};

module.exports = {
    createVolunteer,
    updatedEmail,
    getAllVolunteers
};