import React, {useState} from 'react';
import PropTypes from 'prop-types';

import AvailabilityBanner from './subcomponents/AvailabilityBanner';
import Button from './subcomponents/Button';
import Map from './subcomponents/Map';
import ListView from './subcomponents/ListView';

const MapAndListView = (props) => {
    const [showMap, setShowMap] = useState(true);

    const numAvailable = props.rawSiteData.filter(
        (site) => site.availability.length > 0
    ).length;

    return (
        <div className="map-and-list">
            <div className="button-container">
                <Button
                    title="Map View"
                    icon="map"
                    color={showMap ? 'blue' : 'lightGray'}
                    onClick={() => setShowMap(true)}
                    borderRadius={'4px 0px 0px 4px'}
                />
                <Button
                    title="List View"
                    icon="list"
                    color={showMap ? 'lightGray' : 'blue'}
                    onClick={() => setShowMap(false)}
                    borderRadius={'0px 4px 4px 0px'}
                />
            </div>
            <AvailabilityBanner
                numSites={numAvailable}
                hasAvailability={true}
            />
            <div className="map-and-list-contents">
                {/* Use display: 'none' to avoid rerendering the map and
                losing state (map zoom and center) each time the user toggles
                between the map and list views. */}
                <div style={showMap ? {} : {display: 'none'}}>
                    <Map
                        rawSiteData={props.rawSiteData}
                        center={props.mapCoordinates}
                        zoom={props.mapZoom}
                        onMapChange={props.onMapChange}
                    />
                    <MapKey />
                </div>
                {!showMap && <ListView rawSiteData={props.rawSiteData} />}
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

MapAndListView.propTypes = {
    // The raw site data should be JSON. Improve the type checking here!
    rawSiteData: PropTypes.any.isRequired,
    mapCoordinates: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
    }).isRequired,
    mapZoom: PropTypes.number.isRequired,
    onMapChange: PropTypes.func.isRequired,
};
