import React from 'react';
import PropTypes from 'prop-types';

const InfoBanner = ({isResourcesPage = false}) => (
    <div className="info-banner">
        <p>
            As of April 28, 2021, VaccinateMA will no longer be providing
            updated information on vaccination availability in Massachusetts.
        </p>
        <br />
        <p>
            While we were grateful to have the chance to help our fellow Bay
            Staters find vaccines during the early part of the rollout, our
            state now has widespread vaccine availability and the highest
            percentage of fully-vaccinated eligible adults in the US. If
            you&apos;re still looking for a vaccine, please check out our{' '}
            {isResourcesPage
                ? 'resources page below'
                : <a href={'/resources'}>resources page</a>}{' '}
            for links to other sites that are continuing on.
        </p>
        <br />
        <p>Have a great summer, and stay safe!</p>
        <p>❤ The VaccinateMA team</p>
    </div>
);

export default InfoBanner;

InfoBanner.propTypes = {
    isResourcesPage: PropTypes.bool,
};
