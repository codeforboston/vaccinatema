const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_CRED_USER,
  host: 'ziggy.db.elephantsql.com',
  database: process.env.DB_CRED_USER,
  password: process.env.DB_CRED_PW,
  port: 5432,
});

/**
* Fetch all locations
**/
const getAllLocations = async (sortField, sortOrder) => {
  try {
    const { error, rows } = await pool.query('SELECT * FROM locations l ORDER BY name DESC');
    return rows;
  } catch (error) {
    console.error("an error occurred fetching locations ", error);
    throw new Error("an unexpected error occurred reading from locations DB");
  }
}

/**
* Create a location
**/
const createLocation = async (newLocation) => {
  try {
    const { error, result } = await pool.query('INSERT INTO locations (name, bookinglink, address, serves, siteInstructions, daysOpen, county, latitude, longitude)' +
    ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [newLocation.name, newLocation.bookingLink, newLocation.address, newLocation.serves, newLocation.siteInstructions, newLocation.daysOpen, newLocation.county, newLocation.latitude, newLocation.longitude]);
    if (error){
      console.error(`Error occurred saving location`, error);
      throw new Error("An error occurred saving location");
    }
    console.log(`CREATED LOCATION ${JSON.stringify(result)} `);
    return result;
  } catch (error) {
    console.error(`an error occurred creating location ${newLocation}`, error);
    throw new Error("An unexpected error occurred saving location");
  }
}

module.exports = {
  getAllLocations,
  createLocation
}
