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

module.exports = {
    getClosestLocations: getClosestLocations,
};
