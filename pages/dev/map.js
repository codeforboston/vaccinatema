import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

const Marker = ({ id, lat, lng, tooltip, typeOfSite, setPopupData, getSiteDataByKey, $hover }) => {
    const handleClick = () => {
        console.log(id)
        const data = getSiteDataByKey(id)
        setPopupData({
            lat,
            lng,
            data
        })
        console.log(`You clicked on ${tooltip}`);
      };
    return (
      <div
        className={$hover ? typeOfSite + " hover" : typeOfSite}
        onClick={handleClick}
        style={{
            position: 'absolute',
            transform: 'translate(-50%, -50%)'
        }}
      >
        {$hover && <p>{id + tooltip}</p>}
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

const Popup = ({data}) => (
    <div style={{
        position: 'absolute',
        transform: 'translate(0%, -50%)',
        color: '#000000',
        backgroundColor: '#FFFFFF',
        width: '100px',
        height: '100px'
    }}>
        <p>Hey, I did it!</p>
        <p>{data.locationName}</p>
        <p>{data.populationsServed}</p>
    </div>
)

const Map = () => {
    const [siteData, setSiteData] = useState([]);
    const [popupData, setPopupData] = useState(null);

    const getSiteDataByKey = key => siteData.find(site => {
        return key === site.id
    })

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
                id={site.id}
                lat={site.latitude}
                lng={site.longitude}
                tooltip={site.locationName}
                typeOfSite={site.typeOfSite}
                setPopupData={setPopupData}
                getSiteDataByKey={getSiteDataByKey}
            />
        ))}
        {popupData && (<Popup
            lat={popupData.lat}
            lng={popupData.lng}
            data={popupData.data}
           />)}
        </GoogleMapReact>
        </div>
    )
}

export default Map;
