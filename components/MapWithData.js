import React, {useEffect, useState} from 'react';

import Map from './subcomponents/Map';

const MapWithData = () => {
    const [rawSiteData, setRawSiteData] = useState([]);

    useEffect(
        () => {
            fetch('/initmap')
                .then((response) => response.json())
                .then((rawSiteData) => setRawSiteData(rawSiteData))
                .catch((err) => console.error(err));
        },
        // Empty array as 2nd param so function runs only on initial page load.
        []
    );

    return <Map rawSiteData={rawSiteData} />;
};

export default MapWithData;
