import React, {useEffect, useState} from 'react';

import Layout from '../components/Layout';
import MapAndListView from '../components/MapAndListView';
import SearchBar, {ALL_AVAILABIITY} from '../components/SearchBar';

const Home = () => {
    const [rawSiteData, setRawSiteData] = useState([]);

    useEffect(
        // Before the user makes any searches, default to showing
        // all available sites.
        () => fetchAllSites(false),
        // Empty array as 2nd param so function runs only on initial page load.
        []
    );

    const fetchAllSites = (includeUnavailable) => {
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

    const getLocationData = (args) => {
        if (!args.address && !args.latitude && !args.longitude) {
            return fetchAllSites(args.availability === ALL_AVAILABIITY);
        }

        return fetch('/search_query_location', {
            method: 'post',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({...args}),
        })
            .then((response) => response.json())
            .then((siteData) => setRawSiteData(siteData))
            .catch((error) => {
                // TODO(hannah): Add better error handling.
                console.log(error);
            });
    };

    return (
        <Layout pageTitle="Home">
            <div>
                <SearchBar onSearch={getLocationData} />
                <MapAndListView rawSiteData={rawSiteData} />
            </div>
        </Layout>
    );
};

export default Home;
