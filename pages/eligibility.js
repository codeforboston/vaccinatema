import React from 'react';

import InfoBanner from '../components/InfoBanner';
import Layout from '../components/Layout';

// TODO: should the phase and group be set to variables?

const Eligibility = () => (
    <Layout pageTitle="Eligibility">
        <div id="eligibility-page">
            <InfoBanner />
            <h1>Eligibility</h1>
            <p>
                Everyone age 16+ in Massachusetts is now eligible under{' '}
                <a
                    href="https://www.mass.gov/info-details/covid-19-vaccine-distribution-timeline-phase-overview"
                    target="_blank"
                    rel="noreferrer"
                >
                    Phase 3
                </a>
                , which started on April 19, 2021. Some vaccination clinics may
                have more specific eligibility requirements, so be sure to check
                when signing up. Note that minors (16-17 years old) are only
                eligible to receive the Pfizer vaccine, not Moderna or Janssen.{' '}
                <b>Most sites require appointments. </b>
                Clinics that are open to walk-ins will be listed as such.
            </p>
            <img
                className="eligibility-image"
                src={'../static/updated_eligibility_4_19.png'}
                alt="COVID-19 Vaccination in MA: Phase 1, 2, and 3 Eligibility Status"
            />
        </div>
    </Layout>
);

export default Eligibility;
