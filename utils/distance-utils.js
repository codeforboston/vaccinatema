const zipCodes = require('../static/zip-codes.json');
const geocoder = require('google-geocoder');
const axios = require('axios');

function degreesToRadians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function calculateDistanceInMiles(record, pos_lat, pos_long) {
    // https://www.movable-type.co.uk/scripts/latlong.html
    var lat1 = parseFloat(record.latitude);
    var lat2 = parseFloat(pos_lat);
    var lon1 = parseFloat(record.longitude);
    var lon2 = parseFloat(pos_long);
    var R = 3958.899; // earth's mean radius in miles
    var φ1 = degreesToRadians(lat1);
    var φ2 = degreesToRadians(lat2);
    var Δφ = degreesToRadians(lat2 - lat1);
    var Δλ = degreesToRadians(lon2 - lon1);

    var a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    return d;
}

/**
 * Returns a list of locations, sorted by increasing distance from the given
 * latitude and longitude.
 */
function getClosestLocations(locations, latitude, longitude, maxMiles = null) {
    var locationsWithDistances = locations.map((location) => ({
        location: location,
        distance: calculateDistanceInMiles(location, latitude, longitude),
    }));

    const maxMilesNum = Number.parseFloat(maxMiles);
    if (!Number.isNaN(maxMilesNum)) {
        locationsWithDistances = locationsWithDistances.filter(
            (site) => site.distance <= maxMilesNum
        );
    }

    locationsWithDistances.sort((a, b) => a.distance - b.distance);

    return locationsWithDistances.map(
        (locationWithDistance) => locationWithDistance.location
    );
}

/**
 * Returns an object with the requested latitude (lat) and longitude (lng).
 */
async function getLatLngFromRequest(req) {
    if (req.body.address) {
        let address = req.body.address;
        // Whenever possible, use the static look up table to minimize Geocoder
        // costs.
        if (zipCodes[address]) {
            return zipCodes[address];
        }
        // If not a zipcode, the query should be a town so add the state
        // to make this a relatively simple query to geocode.
        address = address + ' Massachusetts';

        // First try Pelias
        try {
            return await getLatLngPelias(address);
        } catch (exception) {
            console.error('Failed geocoding with Pelias: ', exception);
        }
        // Fall back to Google geocoder
        return await getLatLngGoogle(address);
    }
    return {lat: req.body.latitude, lng: req.body.longitude};
}

async function getLatLngPelias(address) {
    const url = `http://pelias.mapc.org/v1/search?text=${address}MA&boundary.gid=whosonfirst:region:85688645&size=1`;
    const response = await axios.get(url);
    return parsePeliasGeoJson(response.data);
}

/**
 * Best effort to parse GeoJson response from Pelias geocoding, however the
 * the docs do not describe exactly what features of GeoJson are used so the 
 * caller should handle catching exceptions (likely index/key errors).
 */
function parsePeliasGeoJson(geojson) {
    if (geojson['features'].length == 0) {
        throw 'Pelias Geocoding: No results';
    }
    const feature = geojson['features'][0];
    if (feature['geometry']['type'] == 'Point') {
        const coords = feature['geometry']['coordinates'];
        return {lat: coords[1], lng: coords[0]};
    } else {
        throw 'Unexpected returned geojson feature from Pelias';
    }
}

async function getLatLngGoogle(address) {
    const geo = geocoder({key: process.env.GEOCODER_API_KEY});
    const geoRes = await new Promise((resolve, reject) => {
        geo.find(address, (err, res) => {
            // TODO(hannah): Add better error handling.
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
    return geoRes[0].location;
}

module.exports = {
    getClosestLocations: getClosestLocations,
    getLatLngFromRequest: getLatLngFromRequest,
};
