import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

import parseURLsInStrings from '../utilities/parseURLsInStrings';
import {dateToString} from '../utilities/date-utils';

const parseLocationData = (data) => {
    return data.map((site) => ({
        id: site.id,
        locationName: site.name,
        address: site.address,
        populationsServed: parseURLsInStrings(site.serves),
        vaccineAvailability:
            site.availability && parseURLsInStrings(site.availability),
        lastUpdated: dateToString(site.lastUpdated),
        bookAppointmentInformation: parseURLsInStrings(
            site.bookAppointmentInfo,
        ),
        latitude: site.latitude,
        longitude: site.longitude,
        sitePinShape: site.sitePinShape,
    }));
};

// google-map-react allows you to pass a "$hover" destructured prop if you want to have an effect on hover
const Marker = ({ id, lat, lng, sitePinShape, setPopupData, getSiteDataByKey }) => {
    const handleClick = () => {
        const data = getSiteDataByKey(id);
        setPopupData({
            lat,
            lng,
            data
        });
    };
    return (
        <div
            className={sitePinShape}
            onClick={handleClick}
            style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer'
            }}
        >
        </div>
    );
};

Marker.propTypes = {
    id: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    sitePinShape: PropTypes.string,
    setPopupData: PropTypes.func,
    getSiteDataByKey: PropTypes.func,
};

// TODO(hannah): These values were calculated by hand and assume the map is
// 400px tall. We can do this more scientifically, but it'll never be exact
// because the zoom values must be integers.
export const MAX_MILES_TO_ZOOM = {
    '0.25': 17,
    '0.5': 16,
    '1': 15,
    '5': 12,
    '10': 11,
    '25': 10,
};

const Map = ({rawSiteData, center, zoom, onMapChange, setPopupData}) => {
    const [siteData, setSiteData] = useState([]);

    const getSiteDataByKey = key => siteData.find(site => {
        return key === site.id;
    });

    // Update the site data whenever the rawSiteData props change.
    useEffect(() => {
        setSiteData(parseLocationData(rawSiteData));
    }, [rawSiteData]);

    return (
    // Container element must have height and width for map to display. See https://developers.google.com/maps/documentation/javascript/overview#Map_DOM_Elements
        <div style={{height: '400px', width: '100%'}}>
            <GoogleMapReact
                bootstrapURLKeys={{key: process.env.GOOGLE_MAPS_API_KEY}}
                center={center}
                zoom={zoom}
                draggableCursor="crosshair"
                onChange={onMapChange}
            >
                {siteData && siteData.map((site) => (
                    <Marker
                        key={site.id}
                        id={site.id}
                        lat={site.latitude}
                        lng={site.longitude}
                        sitePinShape={site.sitePinShape}
                        setPopupData={setPopupData}
                        getSiteDataByKey={getSiteDataByKey}
                    />
                ))}
            </GoogleMapReact>
        </div>
    );
};

Map.propTypes = {
    rawSiteData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            address: PropTypes.string,
            serves: PropTypes.string,
            availability: PropTypes.string,
            lastUpdated: PropTypes.number,
            bookAppointmentInfo: PropTypes.string,
            latitude: PropTypes.number,
            longitude: PropTypes.number,
            instructionsAtSite: PropTypes.string,
            sitePinShape: PropTypes.string,
        })
    ),
    center: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
    }).isRequired,
    zoom: PropTypes.number.isRequired,
    // ({center: {lat: number, lng: number}, zoom: number}) => void
    onMapChange: PropTypes.func.isRequired,
    setPopupData: PropTypes.func.isRequired,
};

export default Map;
