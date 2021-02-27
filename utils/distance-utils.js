function degreesToRadians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function calculateDistance(record, pos_lat, pos_long) {
    var lat1 = parseFloat(record.latitude);
    var lat2 = parseFloat(pos_lat);
    var lon1 = parseFloat(record.longitude);
    var lon2 = parseFloat(pos_long);
    var R = 6371000; // metres
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
 * Returns a list of the n closest locations to the given latitude and longitude.
 */
function getClosestLocations(locations, n, latitude, longitude) {
    var locationsWithDistances = locations.map(location => ({
        location: location,
        distance: calculateDistance(location, latitude, longitude),
    }));

    locationsWithDistances.sort((a, b) => (a.distance - b.distance));

    return locationsWithDistances
        .slice(0, n)
        .map((locationWithDistance) => locationWithDistance.location);
}

module.exports = {
    calculateDistance: calculateDistance,
    getClosestLocations: getClosestLocations,
};
