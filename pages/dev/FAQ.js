import React from 'react';

import Layout from '../../components/Layout';
import EmailLink from '../../components/subcomponents/EmailLink';

const FAQ = () => (
    <Layout pageTitle="FAQ">
        <div id="faq-page">
            <h1>Frequently Asked Questions</h1>
            <h6>
                We are a group of volunteers helping Massachusetts residents get
                vaccinated. Our site uses a mix of automated and crowdsourced
                data to show vaccine appointment availability. VaccinateMA
                launched on January 17, 2021.
            </h6>
            <h2>Why are you doing this? Isn’t there a state site?</h2>
            <p>
                Massachusetts is ~40th out of 50 states in percentage of doses
                administered,{' '}
                <a
                    href="https://www.nytimes.com/interactive/2020/us/covid-19-vaccine-doses.html"
                    target="_blank"
                    rel="noreferrer"
                >
                    according to the CDC
                </a>
                . We&apos;ve found that the{' '}
                <a
                    href="https://vaxfinder.mass.gov/"
                    target="_blank"
                    rel="noreferrer"
                >
                    existing state website
                </a>{' '}
                has availability for mass vaccination sites, but our website
                covers 100+ additional local and retail sites. We use a
                combination of automation and manual checking by volunteers.
            </p>
            <h2>What if I want to help?</h2>
            <p>
                Shoot us an email at <EmailLink />.
            </p>
            <h2>What if I&apos;m a reporter and I want to contact you?</h2>
            <p>
                Shoot us an email at <EmailLink />.
            </p>
            <h2>Who are you?</h2>
            <p>
                We are a group of volunteers including Code for Boston, Zane,
                Madeleine, Kunal Shah, and many other engaged citizens.
            </p>
        </div>
    </Layout>
);

export default FAQ;
