import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

const Marker = ({ text, tooltip, typeOfSite, $hover }) => {
    const handleClick = () => {
        console.log(`You clicked on ${tooltip}`);
      };
    return (
      <div
        className={$hover ? typeOfSite + " hover" : typeOfSite}
        onClick={handleClick}
      >
      </div>
    )
}

const parseDate = dateString => (
    new Date(Date.parse(dateString)).toLocaleString('en-US', {timeZone: "America/New_York"})
)

const parseLocationData = data => {
    return data.map( site => (
        {
            id: site.id,
            locationName: site.fields["Location Name"],
            address: site.fields["Full Address"],
            populationsServed: site.fields["Serves"],
            vaccineAvailability: site.fields["Availability"],
            lastUpdated: parseDate(site.fields["Last Updated"]),
            bookAppointmentInformation: site.fields["Book an appointment"],
            latitude: site.fields["Latitude"],
            longitude: site.fields["Longitude"],
            typeOfSite: determineTypeOfSite(
                site.fields["Availability"],
                site.fields["Serves"],
                site.fields["Location Name"]
            )
        }
    ))
}

const determineTypeOfSite = (availability, serves, locationName) => {
    if (availability?.trim() === 'None') {
        return "dot"
    } else if (serves?.trim() === "Eligible populations statewide") {
        return "star star-green"
    } else if (
        locationName === "Foxborough: Gillette Stadium"
        || locationName === "Boston: Fenway Park"
        || locationName === "Danvers: Doubletree Hotel"
        || locationName === "Springfield: Eastfield Mall"
      ) {
        return "star star-red"
    } else {
        return "star star-blue"
    }
}

const PopUp = () => (
    <div>
        <p>I am a pop-up!</p>
    </div>
)

const Map = () => {
    const [siteData, setSiteData] = useState([]);
    const [showPopUp, setShowPopUp] = useState(true);

    useEffect(() => {
        fetch('/initmap')
        .then(response => response.json())
        .then(siteData => parseLocationData(siteData))
        .then(siteData => setSiteData(siteData))
    });

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '400px', width: '50%' }}>
        <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyDxF3aT2MwmgzcAzFt5PtB-B3UNp4Js2h4" }}
            defaultCenter={{ lat: 42.3876, lng: -71.0995 }}
            defaultZoom={15}
        >
        {siteData && siteData.map((site) => (
            <Marker
                key={site.id}
                lat={site.latitude}
                lng={site.longitude}
                text={site.locationName}
                tooltip={site.locationName}
                typeOfSite={site.typeOfSite}
            />
        ))}
        {showPopUp && (<PopUp style={{ position: 'absolute', top: 0, left: 0, width: '200px' }} />)}
        {popupInfo && (<Popup
            store={popupInfo}
            lat={popupInfo.latitude}
            lng={popupInfo.longitude}
           />)}
        </GoogleMapReact>
        </div>
    )
}

export default Map;
