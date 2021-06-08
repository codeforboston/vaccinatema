import React from 'react';

import InfoBanner from '../components/InfoBanner';
import Layout from '../components/Layout';
import EmailLink from '../components/subcomponents/EmailLink';

const FAQ = () => (
    <Layout pageTitle="FAQ">
        <div id="faq-page">
            <InfoBanner />
            <h1>Frequently Asked Questions</h1>
            <p className="faq-description">
                We are a group of volunteers helping Massachusetts residents get
                vaccinated. Our site uses a mix of automated and crowdsourced
                data to show vaccine appointment availability. VaccinateMA
                launched on January 17, 2021.
            </p>
            <h2>Why are you doing this? Isn’t there a state site?</h2>
            <p>
                For many weeks, Massachusetts lagged behind in distributing the
                doses it had been shipped. In late January 2021, we were ranked{' '}
                <a
                    href="https://www.wbur.org/cognoscenti/2021/01/25/covid-vaccine-rollout-slow-mass-miles-howard"
                    target="_blank"
                    rel="noreferrer"
                >
                    43rd
                </a>{' '}
                out of 50 states in terms of percentage doses administered from
                the ones we had received. Recently, our statistics have much
                improved, but there is still confusion about where to get a
                COVID-19 vaccine and how. We&apos;ve also found that the{' '}
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
            <h2>
                Why do you have vaccination locations not on other websites?
            </h2>
            <p>
                We regularly research where the vaccine is being administered
                across the state, which sometimes results in our website showing
                locations not listed elsewhere.
            </p>
            <h2>
                Your website said there was an appointment, but there
                wasn&apos;t one when I tried to register. Why?
            </h2>
            <p>
                Most of our availability information is gathered by hand by a
                group of dedicated volunteers. Some sites only get updated once
                a day — the time at which the data was entered can be found
                under &quot;last updated.&quot; Also, appointments get booked
                very quickly and sometimes a spot gets filled by someone else in
                the time it takes to register. We encourage you to check{' '}
                <a
                    href="https://macovidvaccines.com"
                    target="_blank"
                    rel="noreferrer"
                >
                    macovidvaccines.com
                </a>{' '}
                or{' '}
                <a
                    href="https://twitter.com/vaccinetime"
                    target="_blank"
                    rel="noreferrer"
                >
                    twitter.com/vaccinetime
                </a>{' '}
                for other sources of availability.
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
            <br />
            <p>
                <i>
                    Inspired by{' '}
                    <a
                        href="https://vaccinateca.com"
                        target="_blank"
                        rel="noreferrer"
                    >
                        vaccinateca.com
                    </a>{' '}
                    and Tyler Cowen of{' '}
                    <a
                        href="https://marginalrevolution.com"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Marginal Revolution
                    </a>
                    .
                </i>
            </p>
        </div>
    </Layout>
);

export default FAQ;
