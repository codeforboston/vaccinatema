import React, {useEffect, useState} from 'react';

import PreregisterBanner from '../components/PreregisterBanner';
import Layout from '../components/Layout';
import MapAndListView from '../components/MapAndListView';
import SearchBar, {ALL_AVAILABIITY} from '../components/SearchBar';
import {MAX_MILES_TO_ZOOM} from '../components/subcomponents/Map';

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

        fetch('/initmap')
            .then((response) => response.json())
            .then((rawSiteData) => {
                // TODO(hannah): Currently, in list view, the sites are
                // just listed alphabetically. Per discussions with Harlan,
                // we should be sorting them some more useful way.
                if (includeUnavailable) {
                    return rawSiteData;
                }
                // TODO(hannah): Create new endpoint to only return available
                // sites.
                return rawSiteData.filter(
                    (site) => site.availability.length > 0
                );
            })
            .then((rawSiteData) => setRawSiteData(rawSiteData))
            .catch((err) => console.error(err));
    };

    const onSearch = (args) => {
        if (!args.address && !args.latitude && !args.longitude) {
            return fetchSites({
                includeUnavailable: args.availability === ALL_AVAILABIITY,
            });
        }
        return fetch('/search_query_location', {
            method: 'post',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({...args}),
        })
            .then((response) => response.json())
            .then((response) => {
                const {lat, lng, siteData} = response;
                setRawSiteData(siteData);
                setMapCoordinates({lat, lng});
                setMapZoom(
                    MAX_MILES_TO_ZOOM[args.maxMiles] || DEFAULT_ZOOMED_IN
                );
            })
            .catch((error) => {
                // TODO(hannah): Add better error handling.
                console.log(error);
            });
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
