const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_CRED_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_CRED_USER,
  password: process.env.DB_CRED_PW,
  port: 5432,
});

/**
 * convert a number of miles to meters
 * @param {*} numMiles 
 */
function getMeters(numMiles) {
  return numMiles * 1609.344;
}

/**
* Fetch all locations
**/
const getAllLocations = async () => {
  try {
    const { rows } = await pool.query(
      'SELECT l.* ' +
      ' FROM locations l ' +
      ' ORDER BY name desc ');
    return rows;
  } catch (error) {
    console.error("an error occurred fetching locations ", error);
    throw new Error("an unexpected error occurred reading from locations DB");
  }
}

/**
 * Find all locations close to the lat/long of a given destination within 
 * a defined rangeInMiles
 * @param {*} homeLat 
 * @param {*} homeLong 
 * @param {*} rangeInMiles 
 */
const getLocationsCloseToGeo = async (homeLat, homeLong, rangeInMiles) => {
  try {
    // query units require meters, so convert the miles to meters before querying
    const rangeInMeters = getMeters(rangeInMiles);

    console.log(`LOCATION LOOKUP BASED ON GEO: ${homeLat} ${homeLong} RangeInMeters: ${rangeInMeters}`)
    const { error, rows, query } = await pool.query(
      'SELECT l.*, ' +
      '       la.availabilitydetails, '+
      '       la.lastupdated, ' + 
      '       ROUND(earth_distance(ll_to_earth($1, $2), ll_to_earth(latitude, longitude)) :: NUMERIC, 2) AS distanceMeters ' +
      ' FROM locations l ' +
      ' LEFT OUTER JOIN location_availability la ON la.location_id = l.id ' + 
      ' WHERE earth_distance(ll_to_earth($1, $2), ll_to_earth(latitude, longitude)) <= $3 ' +
      ' ORDER BY distanceMeters DESC ', [homeLat, homeLong, rangeInMeters]);
    return rows;
  } catch (error) {
    console.error("an error occurred fetching locations ", error);
    throw new Error("an unexpected error occurred reading from locations DB");
  }
}

/**
 * Create a location
 * @param {*} newLocation 
 */
const createLocation = async (newLocation) => {
  try {
    const result  = await pool.query('INSERT INTO locations (name, bookinglink, address, serves, siteInstructions, daysOpen, county, latitude, longitude, availabilitydetails) ' +
    ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  RETURNING *', [newLocation.name, newLocation.bookinglink, newLocation.address, newLocation.serves, newLocation.siteinstructions, newLocation.daysopen, newLocation.county, newLocation.latitude, newLocation.longitude, newLocation.availabilitydetails]);
    console.log(`CREATED LOCATION ${JSON.stringify(result.rows[0])} `);
    const insertedRow = result.rows[0];
    return insertedRow;
  } catch (error) {
    console.error(`an error occurred creating location ${newLocation}`, error);
    throw new Error(`An unexpected error occurred saving location with error: ${error}`);
  }
}

/**
 * Build the location update query to only update the fields specified on
 * the colsToUpdate
 * @param {*} locationId 
 * @param {*} colsToUpdate 
 */
function buildUpdateLocationQuery (locationId, colsToUpdate) {
  // Setup static beginning of query
  var query = ['UPDATE locations'];
  query.push('SET');

  // Create another array storing each set command
  // and assigning a number value for parameterized query
  var set = [];
  Object.keys(colsToUpdate).forEach(function (key, i) {
    set.push(key + ' = ($' + (i + 1) + ')'); 
  });
  query.push(set.join(', '));

  // Add the WHERE statement to look up by id
  query.push('WHERE id = ' + locationId );
  query.push(' RETURNING *');

  // Return a complete query string
  return query.join(' ');
}

/**
 * Update the location with the specified details in the locationObject
 * @param {*} locationId 
 * @param {*} locationObject 
 */
const updateLocation = async (locationId, locationObject) => {
  try {
    let query = buildUpdateLocationQuery(locationId, locationObject);
    // only update the columns that were specified
    var columnValues = Object.keys(locationObject).map(function (key) {
      return locationObject[key];
    });

    const result  = await pool.query(query, columnValues);
    const updatedRow = result.rows[0];
    console.log(`UPDATED LOCATION ${JSON.stringify(updatedRow)} `);
    return updatedRow;
  } catch (error) {
    console.error(`an error occurred updating location ${locationObject}`, error);
    throw new Error("An unexpected error occurred updating location");
  }
}

/**
 * Delete the location with the specified locationId
 * @param {*} locationId 
 */
const deleteLocation = async (locationId) => {
  try {
    let query = 'DELETE FROM locations where id = $1'
    await pool.query(query, [locationId]);
    console.log(`DELETED LOCATION ${locationId} `);
  } catch (error) {
    console.error(`an error occurred deleting location ${locationId}`, error);
    throw new Error("An unexpected error occurred deleting location");
  }
}


module.exports = {
  getAllLocations,
  getLocationsCloseToGeo,
  createLocation,
  updateLocation,
  deleteLocation
}
