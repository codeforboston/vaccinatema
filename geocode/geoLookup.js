var geocoder = require('google-geocoder');

var geo = geocoder({
    key: 'AIzaSyDxF3aT2MwmgzcAzFt5PtB-B3UNp4Js2h4'
});

/**
 * Use googles API to identify the lat/long for a given fullAddressString
 * @param {*} fullAddressString 
 */
const getLatLngByAddress = async (fullAddressString) =>
{
    return new Promise((resolve, reject) => {
        geo.find(fullAddressString, function (err, results, status) {
            if(err){
                console.log(`ERROR OCCURRED LOOKING UP LAT/LONG for fullAddressString: ${fullAddressString} error:${JSON.stringify(err)}`);
                resolve({});
            }
            if(results) {
                var latitude = results[0].location.lat;
                var longitude = results[0].location.lng;
                let geoLocation = { latitude, longitude };
                resolve(geoLocation);
            } else {
                reject(status);
            }
        });
    });
}

module.exports = {
    getLatLngByAddress
}
  