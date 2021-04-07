import React from 'react';

import Layout from '../components/Layout';

// TODO: should the phase and group be set to variables?

const Eligibility = () => (
    <Layout pageTitle="Eligibility">
        <div id="eligibility-page">
            <h1>Eligibility</h1>
            <p>
                Massachusetts is now in vaccine eligibility Phase 2, Group 5,
                which started on April 5, 2021. Please check all eligibility
                requirements below and sign up for your appointment in advance
                using the link or phone number included in the site location’s
                details. Note that minors (16-17 years old) are only eligible to
                receive the Pfizer vaccine, not Moderna or Janssen. Vaccination locations
                are available only to those within active and eligible priority
                groups as a part of the Massachusetts{' '}
                <a
                    href="https://www.mass.gov/info-details/covid-19-vaccine-distribution-timeline-phase-overview"
                    target="_blank"
                    rel="noreferrer"
                >
                    vaccine distribution timeline
                </a>
                . Individuals must present proof of their eligibility to receive
                the vaccine. <b>All sites require appointments.</b>
            </p>
            <img
                className="eligibility-image"
                src={'../static/updated_eligibility_4_5.png'} 
                alt="COVID-19 Vaccination in MA: Phase 1, 2, and 3 Eligibility Status"
            />
        </div>
    </Layout>
);

export default Eligibility;
