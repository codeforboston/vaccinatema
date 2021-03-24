const dotenv = require("dotenv");
//note: this only works locally; in Lambda we use environment variables set manually
dotenv.config();

const { Client } = require("@googlemaps/google-maps-services-js");
const { generateKey } = require("./data/dataDefaulter");
const axios = require("axios");
const axiosRetry = require("axios-retry");
const fetch = require("node-fetch");
const peliasServer = process.env.PELIAS_SERVER;

axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

async function fetchResponse({ url, method, headers, body }) {
    return await fetch(url, {
        method,
        body,
        headers,
    }).then(
        (res) => res.json(),
        (err) => {
            console.error(err);
            return null;
        }
    );
}


const getGeocode = async (name, street, zip) => {
    const address = `${name},MA,${street},${zip}`;
    // const client = new Client();
    try {
        const resp =  await fetchResponse({
            url: peliasServer + `/search?boundary.country=USA&text=${address}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            }
        })
        // const resp = await client.geocode(
        //     {
        //         params: {
        //             address,
        //             key: process.env.GEOCODER_API_KEY,
        //         },
        //     },
        //     axios
        // );
        // return resp.data;
        return resp
    } catch (e) {
        console.error(e);
    }
};

const getAllCoordinates = async (locations, cachedResults) => {
    const existingLocations = cachedResults.reduce((acc, location) => {
        const { latitude, longitude, street } = location;
        if (latitude && longitude) {
            acc[generateKey(location)] = {
                latitude,
                longitude,
                street
            };
            return acc;
        } else {
            return acc;
        }
    }, {});

    const coordinateData = await Promise.all(
        locations.map(async (location) => {
            const { name = "", street = "", zip = "" } = location;
            const locationInd = generateKey(location);

            // if (existingLocations[locationInd]) {
            //     return { ...location, ...existingLocations[locationInd] };
            // } else {
                const locationData = await getGeocode(name, street, zip);

                if (locationData) {
                    return {
                        ...location,
                        latitude:
                            locationData?.results[0].geometry.location.lat,
                        longitude:
                            locationData?.results[0].geometry.location.lng,
                    };
                } else return location;
            // }
        })
    );
    return coordinateData;
};

exports.getAllCoordinates = getAllCoordinates;
