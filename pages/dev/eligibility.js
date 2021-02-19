import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../../components/Layout';
import { withTranslation } from '../../i18n';

// TODO: should the phase and group be set to variables?

const Eligibility = ({t}) => (
  <Layout pageTitle="Eligibility">
    <div id="eligibility-page">
      <h1>{t('eligibility_title')}</h1>
      <h6>
        Massachusetts is now in vaccine eligibility Phase 2, Group 1, which started on Febuary 1, 2021. Please check
        all eligibility requirements below and sign up for your appointment in advance using the link or phone number
        included in the site location’s details. Vaccination locations are available only to those within active and
        eligible priority groups as a part of the Massachusetts{' '}
        <a href="https://www.mass.gov/info-details/covid-19-vaccine-distribution-timeline-phase-overview"
          target="_blank" rel="noreferrer">
          vaccine distribution timeline
        </a>
        . Individuals must present proof of their eligibility to receive the vaccine.{' '}
        <b>All sites require appointments.</b>
      </h6>
      <img className="eligibility-image"
        src="https://www.mass.gov/files/styles/embedded_full_width/public/images/2021-02/covidvaccine_phases-1-and-2ab-timing-by-group_social_1920x1080-no-url.png"
        alt="Eligibility"/>
    </div>
  </Layout>
);

export default withTranslation('common')(Eligibility);

Eligibility.propTypes = {
  t: PropTypes.func,
};
