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
        const {
            rows,
        } = await pool.query(
            'INSERT INTO volunteers (email, firstName, lastName, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                volunteer.email,
                volunteer.firstName,
                volunteer.lastName,
                volunteer.role,
            ]
        );
        return rows[0];
    } catch (error) {
        console.error(
            `an error occurred when creating a new volunteer ${volunteer}`,
            volunteer
        );
        throw new Error(
            `An unexpected error occurred creating a new volunteer error: ${error}`
        );
    }
};

/**
 * Build the volunteer update query to only update the fields specified on
 * the colsToUpdate
 */
function buildUpdateVolunteerQuery(volunteerId, colsToUpdate) {
    // Setup static beginning of query
    var query = ['UPDATE volunteers'];
    query.push('SET');

    // Create another array storing each set command
    // and assigning a number value for parameterized query
    var set = [];
    Object.keys(colsToUpdate).forEach(function (key, i) {
        set.push(key + ' = ($' + (i + 1) + ')');
    });
    query.push(set.join(', '));

    // Add the WHERE statement to look up by id
    query.push('WHERE id = ' + volunteerId);
    query.push(' RETURNING *');

    // Return a complete query string
    return query.join(' ');
}

/**
 * Update the volunteer with the specified details in the volunteerObject
 */
const updateVolunteer = async (id, volunteerObject) => {
    try {
        let query = buildUpdateVolunteerQuery(id, volunteerObject);
        // only update the columns that were specified
        const columnValues = Object.keys(volunteerObject).map(function (key) {
            return volunteerObject[key];
        });
        const {rows} = await pool.query(query, columnValues);
        const updatedRow = rows[0];
        console.log(`UPDATED VOLUNTEER ${JSON.stringify(updatedRow)} `);
        return updatedRow;
    } catch (error) {
        console.error(
            `an error occurred when updating a volunteer's email ${id}, ${volunteerObject}`
        );
        throw new Error(
            `An unexpected error occurred updating a volunteer's email error: ${error}`
        );
    }
};

/**
 * Get all volunteers
 **/
const getAllVolunteers = async () => {
    try {
        const {rows} = await pool.query('SELECT * FROM volunteers');
        return rows;
    } catch (error) {
        console.error('an error occurred when getting all volunteers');
        throw new Error(
            `An unexpected error occurred updating a volunteer's email error: ${error}`
        );
    }
};

/**
 * Get all volunteers
 **/
const getVolunteerByEmail = async (email) => {
    try {
        const {
            rows,
        } = await pool.query('SELECT * FROM volunteers WHERE email = $1', [
            email,
        ]);
        return rows;
    } catch (error) {
        console.error('an error occurred when getting volunteers by email');
        throw new Error(
            `An unexpected error fetching by a volunteer's email error: ${error}`
        );
    }
};

/**
 * Delete volunteers
 **/
const deleteVolunteer = async (volunteerId) => {
    try {
        await pool.query('DELETE FROM volunteers WHERE id = $1', [volunteerId]);
        return {result: 'deleted', id: volunteerId};
        // todo delete associated volunteer locations
    } catch (error) {
        console.error(
            `an error occurred when updating a volunteer ${volunteerId}`,
            volunteerId
        );
        throw new Error(
            `An unexpected error occurred updating a volunteerId error: ${error}`
        );
    }
};

/**
 * Create volunteer to location mapping
 **/
const createVolunteerMapping = async (volunteerId, locationId) => {
    try {
        const {
            rows,
        } = await pool.query(
            'INSERT INTO volunteerLocations (volunteer_id, location_id) VALUES ($1, $2) RETURNING *',
            [volunteerId, locationId]
        );
        return rows[0];
    } catch (error) {
        console.error(
            `an error occurred when creating a new volunteer mapping ${volunteerId} - ${locationId}`,
            volunteerId,
            locationId
        );
        throw new Error(
            `An unexpected error occurred creating a new volunteer: ${error}`
        );
    }
};

/**
 * Get all locations a volunteer is responsible for
 **/
const getVolunteerLocations = async (volunteerId) => {
    try {
        const query =
            'SELECT l.*, ' +
            " COALESCE(json_agg(la) FILTER (WHERE la.id IS NOT NULL), '{}') as availability" +
            ' FROM volunteers v ' +
            ' INNER JOIN volunteerLocations vL ON vL.volunteer_id = v.id ' +
            ' INNER JOIN locations l ON l.id = vL.location_id ' +
            ' LEFT JOIN location_availability la ON la.location_id = l.id ' +
            ' WHERE v.id = $1 ' +
            ' GROUP BY l.id ' +
            ' ORDER BY l.name desc ';
        const {rows} = await pool.query(query, [volunteerId]);
        return rows;
    } catch (error) {
        console.error('an error occurred fetching locations ', error);
        throw new Error(
            'an unexpected error occurred reading from locations DB'
        );
    }
};

/**
 * Delete a volunteer to location mapping
 **/
const deleteVolunteerLocationMapping = async (volunteerId, locationId) => {
    try {
        const {
            rows,
        } = await pool.query(
            'DELETE FROM volunteerLocations WHERE volunteer_id = $1 AND location_id = $2',
            [volunteerId, locationId]
        );
        return rows;
    } catch (error) {
        console.error(
            `an error occurred when updating a volunteer mapping ${volunteerId}`,
            volunteerId
        );
        throw new Error(
            `An unexpected error occurred updating a volunteer mapping error: ${error}`
        );
    }
};

module.exports = {
    createVolunteer,
    updateVolunteer,
    getAllVolunteers,
    getVolunteerByEmail,
    deleteVolunteer,
    createVolunteerMapping,
    getVolunteerLocations,
    deleteVolunteerLocationMapping,
};
