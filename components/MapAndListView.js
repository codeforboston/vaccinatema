import React, {useEffect, useState} from 'react';

import Button from './subcomponents/Button';
import Map from './subcomponents/Map';
import ListView from './subcomponents/ListView';

const MapAndListView = () => {
    const [showMap, setShowMap] = useState(true);
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

    return (
        <div className="map-and-list">
            <div className="button-container">
                <Button
                    title="Map View"
                    icon="map"
                    color={showMap ? 'blue' : 'gray'}
                    onClick={() => setShowMap(true)}
                    borderRadius={'4px 0px 0px 4px'}
                />
                <Button
                    title="List View"
                    icon="list"
                    color={showMap ? 'gray' : 'blue'}
                    onClick={() => setShowMap(false)}
                    borderRadius={'0px 4px 4px 0px'}
                />
            </div>
            <div className="map-and-list-contents">
                {showMap ? (
                    <div>
                        <Map rawSiteData={rawSiteData} />
                        <MapKey />
                    </div>
                ) : (
                    <ListView rawSiteData={rawSiteData} />
                )}
            </div>
        </div>
    );
};

const MapKey = () => (
    <div>
        <br />
        <p>
            <b> Red star: </b> Mass Vaccination Sites (high volume, large venue
            sites)
        </p>
        <p>
            <b> Green star: </b> General Vaccination Sites (healthcare
            locations)
        </p>
        <p>
            <b> Blue star: </b> Local Vaccination Site (open to select
            cities/towns)
        </p>
        <p>
            <b> Gray dot: </b> No availability currently
        </p>
    </div>
);

export default MapAndListView;
