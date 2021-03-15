import React from 'react';

const InfoBanner = () => (
    <div className="info-banner">
        <p>
            {'As of '}
            <a
                href="https://www.mass.gov/info-details/preregister-for-a-covid-19-vaccine-appointment"
                target="_blank"
                rel="noreferrer"
            >
                March 12
            </a>
            {' all MA residents can '}
            <a
                href="https://vaccinesignup.mass.gov"
                target="_blank"
                rel="noreferrer"
            >
                preregister
            </a>
            {
                ' for a COVID-19 vaccine appointment at one of the mass vaccination sites. Once eligible, you can either wait to be contacted with a slot or you can book an appointment elsewhere. VaccinateMA continues to check availability daily at retail pharmacies, regional clinics, hospitals, and other locations.'
            }
        </p>
    </div>
);

export default InfoBanner;
