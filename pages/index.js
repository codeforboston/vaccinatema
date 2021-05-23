import React, {useEffect, useState} from 'react';

import {getClosestLocations} from '../utils/distance-utils';
import {MAX_MILES_TO_ZOOM} from '../components/subcomponents/Map';
import Layout from '../components/Layout';
import MapAndListView from '../components/MapAndListView';
import PreregisterBanner from '../components/PreregisterBanner';
import SearchBar, {ALL_AVAILABIITY} from '../components/SearchBar';

const SITES = require('../static/sites.json');
const ZIP_CODES = require('../static/zip-codes.json');

const DEFAULT_ZOOMED_OUT = 8;
const DEFAULT_ZOOMED_IN = 9;
const BOSTON_COORDINATES = {lat: 42.360081, lng: -71.058884};

const Home = () => {
    const [rawSiteData, setRawSiteData] = useState([]);
    const [mapCoordinates, setMapCoordinates] = useState(BOSTON_COORDINATES);
    const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOMED_OUT);

    useEffect(
        // Before the user makes any searches, default to showing all available
        // sites.
        () => fetchSites({includeUnavailable: false}),
        // Empty array as 2nd param so function runs only on initial page load.
        []
    );

    const fetchSites = ({includeUnavailable}) => {
        // Clear coordinates and zoom.
        setMapCoordinates(BOSTON_COORDINATES);
        setMapZoom(DEFAULT_ZOOMED_OUT);

        // TODO(hannah): Currently, in list view, the sites are just listed
        // alphabetically. Per discussions with Harlan, we should be sorting
        // them some more useful way.
        if (includeUnavailable) {
            setRawSiteData(SITES);
            return;
        }

        setRawSiteData(SITES.filter((site) => site.availability.length > 0));
    };

    const getLatLngForSearch = (args) => {
        if (args.address) {
            if (ZIP_CODES[args.address]) {
                return ZIP_CODES[args.address];
            }
            throw 'Invalid ZIP code.';
        }
        if (args.latitude && args.longitude) {
            return {lat: args.latitude, lng: args.longitude};
        }
        throw 'Insufficient location information.';
    };

    const onSearch = (args) => {
        if (!args.address && !args.latitude && !args.longitude) {
            return fetchSites({
                includeUnavailable: args.availability === ALL_AVAILABIITY,
            });
        }

        var locations = [];
        if (args.availability === 'Sites with reported doses') {
            locations = SITES.filter((site) => site.availability.length > 0);
        } else {
            locations = SITES;
        }

        const {lat, lng} = getLatLngForSearch(args);
        const siteData = getClosestLocations(
            locations,
            lat,
            lng,
            args.maxMiles
        );
        setRawSiteData(siteData);
        setMapCoordinates({lat, lng});
        setMapZoom(MAX_MILES_TO_ZOOM[args.maxMiles] || DEFAULT_ZOOMED_IN);
    };

    const onMapChange = ({center, zoom}) => {
        setMapCoordinates(center);
        setMapZoom(zoom);
    };

    return (
        <Layout pageTitle="Home" containerClassName="home-page">
            <div>
                <SearchBar onSearch={onSearch} />
                <PreregisterBanner />
                <MapAndListView
                    rawSiteData={rawSiteData}
                    mapCoordinates={mapCoordinates}
                    mapZoom={mapZoom}
                    onMapChange={onMapChange}
                />
            </div>
        </Layout>
    );
};

export default Home;
