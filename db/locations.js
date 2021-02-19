const Pool = require('pg').Pool;
const pool = new Pool({
  user: process.env.DB_CRED_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_CRED_PW,
  port: process.env.DB_PORT,
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
    console.log('getting locations');
    const query = 'SELECT l.*, ' +
    ' COALESCE(json_agg(la) FILTER (WHERE la.id IS NOT NULL), \'{}\') as availability' +
    ' FROM locations l ' + 
    ' LEFT OUTER JOIN location_availability la ON la.location_id = l.id ' +
    ' GROUP BY l.id ' +
    ' ORDER BY l.name desc ';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('an error occurred fetching locations ', error);
    throw new Error('an unexpected error occurred reading from locations DB');
  }
};

/**
 * Fetch all locations that match the provided name
 **/
const getLocationsByName = async (locationName) => {
  try {
    const locationNameToLookup = '%'+locationName.toLowerCase()+'%';
    console.log(`getting locations by name: ${locationNameToLookup}`);
    const query = 'SELECT l.*, ' +
            ' COALESCE(json_agg(la) FILTER (WHERE la.id IS NOT NULL), \'{}\') as availability' +
            ' FROM locations l ' +
            ' LEFT OUTER JOIN location_availability la ON la.location_id = l.id ' +
            ' WHERE LOWER(l.name) LIKE $1 ' +
            ' GROUP BY l.id ' +
            ' ORDER BY l.name desc ';
    const { rows } = await pool.query(query,[locationNameToLookup]);
    return rows;
  } catch (error) {
    console.error('an error occurred fetching locations for location name:  ' + locationName, error);
    throw new Error('an unexpected error occurred reading from locations DB for locationName');
  }
};

/**
 * Find all locations close to the lat/long of a given destination within 
 * a defined rangeInMiles.
 * result set is sorted by distance from location desc
 * @param {*} homeLat 
 * @param {*} homeLong 
 * @param {*} rangeInMiles 
 */
const getLocationsCloseToGeo = async (homeLat, homeLong, rangeInMiles) => {
  try {
    // query units require meters, so convert the miles to meters before querying
    const rangeInMeters = getMeters(rangeInMiles);

    console.log(`LOCATION LOOKUP BASED ON GEO: ${homeLat} ${homeLong} RangeInMeters: ${rangeInMeters}`);

    const query = 'SELECT l.*, ' +
                  '       COALESCE(json_agg(la) FILTER (WHERE la.id IS NOT NULL), \'{}\') as availability, ' +
                  '       ROUND(earth_distance(ll_to_earth($1, $2), ll_to_earth(l.latitude, l.longitude)) :: NUMERIC, 2) AS distanceMeters ' +
                  ' FROM locations l ' +
                  ' LEFT OUTER JOIN location_availability la ON la.location_id = l.id ' + 
                  ' WHERE earth_distance(ll_to_earth($1, $2), ll_to_earth(l.latitude, l.longitude)) <= $3 ' + 
                  ' GROUP BY l.id' +
                  ' ORDER BY distanceMeters DESC ';

    const { rows } = await pool.query(query, [homeLat, homeLong, rangeInMeters]);
    return rows;
  } catch (error) {
    console.error('an error occurred fetching locations ', error);
    throw new Error('an unexpected error occurred reading from locations DB');
  }
};

/**
 * Create a location
 * @param {*} newLocation 
 */
const createLocation = async (newLocation) => {
  try {
    const query = 'INSERT INTO locations ' +
    ' (name, bookinglink, serves, siteInstructions, daysOpen, county, latitude, longitude, address, vaccinesoffered ) ' +
    ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)  RETURNING *';

    const { rows }  = await pool.query(query, [newLocation.name, newLocation.bookinglink, newLocation.serves, newLocation.siteinstructions, newLocation.daysopen, newLocation.county, newLocation.latitude, newLocation.longitude, newLocation.address, newLocation.vaccinesoffered]);
    console.log(`CREATED LOCATION ${JSON.stringify(rows[0])} `);
    const insertedRow = rows[0];

    // if this location is created with initial availability, create it
    if(newLocation.initialAvailability){
      let availability = await insertLocationAvailability(insertedRow.id, newLocation.initialAvailability);
      insertedRow.availability = availability;
    }

    return insertedRow;
  } catch (error) {
    console.error(`an error occurred creating location ${newLocation}`, error);
    throw new Error(`An unexpected error occurred saving location with error: ${error}`);
  }
};

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
    const { rows }  = await pool.query(query, columnValues);
    const updatedRow = rows[0];
    console.log(`UPDATED LOCATION ${JSON.stringify(updatedRow)} `);
    return updatedRow;
  } catch (error) {
    console.error(`an error occurred updating location ${locationObject}`, error);
    throw new Error('An unexpected error occurred updating location');
  }
};


/**
 * Insert new locationavailabilty for the given locationid and details
 * @param {*} locationId 
 * @param {*} availabilitydetails 
 */
const insertLocationAvailability = async (locationId, availabilitydetails) => {
  try {
    const doses = availabilitydetails.doses;
    const availabilitytime = availabilitydetails.availabilitytime;
    console.log(`ADDING LOC AVAILABILITY for locationId: ${locationId} and availabiltyDetails ${JSON.stringify(availabilitydetails)} `);

    // insert the latest availability details for the given location
    const { rows } = await pool.query('INSERT INTO location_availability (location_id, doses, availabilitytime) ' +
    ' VALUES ($1, $2, $3)  RETURNING *', [locationId, doses, availabilitytime]);

    const insertedRow = rows[0];
    return insertedRow;
  } catch (error) {
    console.error(`an error occurred upserting location availability ${locationId}`, error);
    throw new Error(`An unexpected error occurred saving location availability error: ${error}`);
  }
};

/**
 * Delete the location with the specified locationId
 * @param {*} locationId 
 */
const deleteLocation = async (locationId) => {
  try {
    let query = 'DELETE FROM locations where id = $1';
    await pool.query(query, [locationId]);
    console.log(`DELETED LOCATION ${locationId} `);
  } catch (error) {
    console.error(`an error occurred deleting location ${locationId}`, error);
    throw new Error('An unexpected error occurred deleting location');
  }
};

/**
 * Delete the locationAvailability with the specified locationAvailabilityId
 * @param {*} locationId 
 * @param {*} locationAvailabilityId 
 */
const deleteLocationAvailability = async (locationId, locationAvailabilityId) => {
  try {
    console.log(`DELETED LOCATION AVAIL locId: ${locationId} locAvailId: ${locationAvailabilityId}`);
    let query = 'DELETE FROM location_availability where id = $1 and location_id = $2';
    await pool.query(query, [locationAvailabilityId, locationId]);
  } catch (error) {
    console.error(`an error occurred deleting location avail ${locationAvailabilityId}`, error);
    throw new Error('An unexpected error occurred deleting location avail');
  }
};


module.exports = {
  getAllLocations,
  getLocationsByName,
  getLocationsCloseToGeo,
  createLocation,
  updateLocation,
  deleteLocation,
  insertLocationAvailability,
  deleteLocationAvailability
};
