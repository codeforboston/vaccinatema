require('dotenv').config();
const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('applrO42eyJ3rUQyb');
const locationsDb = require('../db/locations');


async function pullClinics() {
  const records = await base('MaVaccSites_Today').select()
    .all();
  return getFields(records);
}

function getFields(records) {
  return records.map(record => {
    return convertAirtableObjectToSqlObject(record.fields);
  });
}

function convertAirtableObjectToSqlObject(airTableObject) {
  return {
    name: airTableObject['Location Name'],
    bookinglink: airTableObject['Book an appointment'] ?  airTableObject['Book an appointment'] : '',
    address: airTableObject['Full Address'],
    serves: airTableObject['Serves'],
    vaccinesoffered: null,
    siteinstructions: airTableObject['Instructions at site'] ? airTableObject['Instructions at site'] : '',
    daysopen: {}, // skipping because we need better data
    county: airTableObject['County'],
    latitude: airTableObject['Latitude'],
    longitude: airTableObject['Longitude'],
    lastupdated: airTableObject['Last Updated'],
    website: airTableObject['Website'],
    accessibility: airTableObject['Accessibility'] ? airTableObject['Accessibility'].replace('\n', '') : '', // to add
    phone: airTableObject['Phone'], // to add
    email: airTableObject['E-mail'] // to add
  };
}

function fetchAirtableRowsAndBackfill() {
  Promise.resolve(pullClinics())
    .then(clinics => {
      const futures = [];
      clinics.forEach(clinic => {
        futures.push(locationsDb.createLocation(clinic));
      });
      return Promise.all(futures);
    })
    .then(response => {
      console.log(response);
      process.exit();
    });
}

fetchAirtableRowsAndBackfill();