import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import parseBookAppointmentString from './utilities/parseBookAppointmentString';

const parseDate = dateString => (
  new Date(Date.parse(dateString)).toLocaleString('en-US', {timeZone: 'America/New_York'})
);

const parseLocationData = data => {
  return data.map( site => (
    {
      id: site.id,
      locationName: site.fields['Location Name'] ?? '',
      address: site.fields['Full Address'] ?? '',
      populationsServed: site.fields['Serves'] ?? '',
      vaccineAvailability: site.fields['Availability'] ?? '',
      lastUpdated: (site.fields['Last Updated'] && parseDate(site.fields['Last Updated'])) ?? '',
      bookAppointmentInformation: (site.fields['Book an appointment'] && parseBookAppointmentString(site.fields['Book an appointment'])) ?? '',
      latitude: site.fields['Latitude'] ?? 0,
      longitude: site.fields['Longitude'] ?? 0,
      sitePinShape: determineSitePinShape(
        site.fields['Availability'] ?? '',
        site.fields['Serves'] ?? '',
        site.fields['Location Name'] ?? ''
      )
    }
  ));
};

const determineSitePinShape = (availability, serves, locationName) => {
  if (!availability || availability?.trim() === 'None') {
    return 'dot';
  } else if (serves?.trim() === 'Eligible populations statewide') {
    return 'star star-green';
  } else if (
    locationName === 'Foxborough: Gillette Stadium'
        || locationName === 'Boston: Fenway Park'
        || locationName === 'Danvers: Doubletree Hotel'
        || locationName === 'Springfield: Eastfield Mall'
  ) {
    return 'star star-red';
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
        <p><b>Availability</b> {data.vaccineAvailability}</p>
        <p>(Availability last updated {data.lastUpdated})</p>
        <p><b>Book now</b> {data.bookAppointmentInformation}</p>
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

const Map = ({height = '400px', width = '100%'}) => {
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

  useEffect(() => {
    fetch('/initmap')
      .then(response => response.json())
      .then(siteData => parseLocationData(siteData))
      .then(siteData => setSiteData(siteData));
  });

  return (
  // Container element must have height and width for map to display. See https://developers.google.com/maps/documentation/javascript/overview#Map_DOM_Elements
    <div style={{ height, width }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyDxF3aT2MwmgzcAzFt5PtB-B3UNp4Js2h4' }}
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
};

export default Map;