import React from 'react';
import PropTypes from 'prop-types';

const SearchResult = (props) => {
    return (
        <div className="search-result">
            <div className="bar" />
            <div>
                <div className="header">
                    <div style={{flex: 2}}>
                        <h3>{props.name}</h3>
                        <p>{props.address}</p>
                    </div>
                    <div style={{flex: 1}}>
                        <h4>{'Appointments may be available'}</h4>
                        <p>{`Last checked ${props.lastChecked}`}</p>
                    </div>
                </div>
                <div className="contents">
                    <div style={{flex: 1}}>
                        <h4>{'Vaccine availability'}</h4>
                        <p>{props.availability}</p>
                    </div>
                    <div style={{flex: 1}}>
                        <h4>{'Site details'}</h4>
                        <p>{props.siteDetails}</p>
                    </div>
                    <div style={{flex: 1}} className="button-container">
                        <a href={props.appointmentURL} target="_blank" rel="noreferrer">
                            <button>
                                {'Make an appointment'}
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;

SearchResult.propTypes = {
    name: PropTypes.string,
    address: PropTypes.string,
    siteDetails: PropTypes.string,
    // TODO(hannah): Adjust style / content when there is no availability.
    hasAvailability: PropTypes.bool,
    availability: PropTypes.string,
    lastChecked: PropTypes.string,
    appointmentURL: PropTypes.string,
};
