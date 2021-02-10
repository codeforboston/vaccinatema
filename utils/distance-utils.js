function degreesToRadians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function calculateDistance(record, pos_lat, pos_long) {
    var lat1 = parseFloat(record.get('Latitude'));
    var lat2 = parseFloat(pos_lat);
    var lon1 = parseFloat(record.get('Longitude'));
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
 * Returns a list of the n closest locations.
 */
function getClosestLocations(locations, distances, n) {
    var outp = [];
    for (var i = 0; i < distances.length; i++) {
        outp.push(i); // add index to output array
        if (outp.length > n) {
            outp.sort(function (a, b) {
                return distances[a] - distances[b];
            }); // descending sort the output array
            outp.pop(); // remove the last index (index of farthest element in output array)
        }
    }
    var closest = [];
    outp.forEach(function (element) {
        closest.push(locations[element]);
    });
    return closest;
}

module.exports = {
    calculateDistance: calculateDistance,
    getClosestLocations: getClosestLocations,
};
