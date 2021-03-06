import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

import parseURLsInStrings from '../utilities/parseURLsInStrings';
import {dateToString} from '../utilities/date-utils';

// High volume, large venue sites
const MASS_VACCINATION_SITES = [
    'Foxborough: Gillette Stadium',
    'Boston: Fenway Park',
    'Danvers: Doubletree Hotel',
    'Springfield: Eastfield Mall',
    'Dartmouth: Former Circuit City', 
    'Lowell: Lowell General Hospital at Cross River Center',
    'Natick: Natick Mall'
];

const ELIGIBLE_PEOPLE_STATEWIDE_TEXT = [
    'All eligible people statewide',
    'Eligible populations statewide'
];

const doesSiteServeAllEligiblePeopleStatewide = serves => ELIGIBLE_PEOPLE_STATEWIDE_TEXT.includes(serves?.trim());

const isSiteAMassVaccinationSite = locationName => MASS_VACCINATION_SITES.includes(locationName);

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
        sitePinShape: determineSitePinShape(
            site.availability, site.serves, site.name,
        ),
    }));
};

const determineSitePinShape = (availability, serves, locationName) => {
    if (!availability) {
        return 'dot';
    } else if (isSiteAMassVaccinationSite(locationName)) {
        return 'star star-red';
    } else if (doesSiteServeAllEligiblePeopleStatewide(serves)) {
        return 'star star-green';
    } else {
        return 'star star-blue';
    }
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

const Popup = ({data, setPopupData}) => (
    <div style={{
        position: 'absolute',
        transform: 'translate(0%, -50%)',
        border: '1px solid black',
        color: '#000000',
        backgroundColor: '#FFFFFF',
        width: '300px',
        borderRadius: '5px',
        boxShadow: '5px 5px',
        padding: '5px'
    }}>
        <div id="content">
            <h4 id="firstHeading" className="firstHeading">{data.locationName}</h4>
            <div id="bodyContent">
                <p><b>Details</b> {data.populationsServed}</p>
                <p><b>Address</b> {data.address}</p>
                <p><b>Availability</b> {data.vaccineAvailability || 'None'}</p>
                <p>(Availability last updated {data.lastUpdated})</p>
                <p><b>Make an appointment</b> {data.bookAppointmentInformation}</p>
                <button onClick={() => setPopupData({})}>Close</button>
            </div>
        </div>
    </div>
);

Popup.propTypes = {
    data: PropTypes.shape(
        {
            locationName: PropTypes.string,
            populationsServed: PropTypes.string,
            address: PropTypes.string,
            vaccineAvailability: PropTypes.string,
            lastUpdated: PropTypes.string,
            bookAppointmentInformation: PropTypes.array,
        }
    ),
    setPopupData: PropTypes.func,
};

const Map = ({height = '400px', width = '100%', rawSiteData}) => {
    const [siteData, setSiteData] = useState([]);
    const [popupData, setPopupData] = useState({});

    const bostonCoordinates = {
        lat: 42.360081,
        lng: -71.058884
    };

    const defaultMassachusettsZoom = 8;

    const getSiteDataByKey = key => siteData.find(site => {
        return key === site.id;
    });

    // Update the site data whenever the rawSiteData props change.
    useEffect(() => {
        setSiteData(parseLocationData(rawSiteData));
    }, [rawSiteData]);

    return (
    // Container element must have height and width for map to display. See https://developers.google.com/maps/documentation/javascript/overview#Map_DOM_Elements
        <div style={{ height, width }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyDLApAjP27_nCB5BbfICaJ0sJ1AmmuMkD0' }}
                defaultCenter={bostonCoordinates}
                defaultZoom={defaultMassachusettsZoom}
                draggableCursor="crosshair"
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
                {popupData.data && (<Popup
                    lat={popupData.lat}
                    lng={popupData.lng}
                    data={popupData.data}
                    setPopupData={setPopupData}
                />)}
            </GoogleMapReact>
        </div>
    );
};

Map.propTypes = {
    height: PropTypes.string,
    width: PropTypes.string,
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
            longitude: PropTypes.number
        })
    )
};

export default Map;
