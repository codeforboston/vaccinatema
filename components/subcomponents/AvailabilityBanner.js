import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons';

const AvailabilityBanner = (props) => {
    // TODO(hannah): Before we can translate this, we'll need a good
    // interpolation solution.
    const text = props.hasAvailability ? (
        props.numSites == 1 ? (
            <p>
                <b>1</b> site has reported available appointments.
            </p>
        ) : (
            <p>
                <b>{props.numSites}</b> sites have reported available
                appointments.
            </p>
        )
    ) : props.numSites == 1 ? (
        <p>
            There is <b>1</b> site that reports no available appointments.
        </p>
    ) : (
        <p>
            There are <b>{props.numSites}</b> sites that report no available
            appointments.
        </p>
    );

    return (
        <span className="availability-banner">
            <FontAwesomeIcon
                icon={props.hasAvailability ? faCheckCircle : faTimesCircle}
            />
            {text}
        </span>
    );
};

export default AvailabilityBanner;

AvailabilityBanner.propTypes = {
    numSites: PropTypes.number.isRequired,
    hasAvailability: PropTypes.bool.isRequired,
};
