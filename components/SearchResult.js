import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';

const SearchResult = (props) => {
    const hasAvailability =
        props.availability !== '' && props.availability !== 'None';
    const googleMapsLink = 'https://maps.google.com/?q=' + props.address;

    return (
        <div className="search-result">
            <div
                className={`bar ${
                    hasAvailability ? 'bar-available' : 'bar-unavailable'
                }`}
            />
            <div className="contents">
                <div
                    className={`header ${
                        hasAvailability
                            ? 'header-available'
                            : 'header-unavailable'
                    }`}
                >
                    <div className="site-name">
                        <h3>{props.name}</h3>
                        <p>
                            <span className="address">{props.address}</span>
                            <a
                                href={googleMapsLink}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FontAwesomeIcon
                                    icon={faMapMarkerAlt}
                                    className="icon"
                                />
                                {'Get directions'}
                            </a>
                        </p>
                    </div>
                    <div className="availability">
                        <h4>
                            {hasAvailability
                                ? 'Appointments may be available'
                                : 'No appointments available'}
                        </h4>
                        <p>
                            <b>{'Last checked '}</b>
                            {props.lastChecked}
                        </p>
                    </div>
                </div>
                <div className="result-body">
                    <div>
                        <h4>{'Vaccine availability'}</h4>
                        <p>{props.availability}</p>
                    </div>
                    <div>
                        <h4>{'Site details'}</h4>
                        <p>{props.siteDetails}</p>
                    </div>
                    <div>
                        {/* TODO(hannah): Change this to a button. */}
                        <h4>
                            {hasAvailability
                                ? 'Make an appointment'
                                : 'About this location'}
                        </h4>
                        <p>{props.bookAppointmentInfo}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;

SearchResult.propTypes = {
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    siteDetails: PropTypes.string.isRequired,
    availability: PropTypes.arrayOf(PropTypes.string).isRequired,
    lastChecked: PropTypes.string.isRequired,
    bookAppointmentInfo: PropTypes.array.isRequired,
};
