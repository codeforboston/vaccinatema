import React from 'react';

import Layout from '../components/Layout';
import EmailLink from '../components/subcomponents/EmailLink';

const FAQ = () => (
    <Layout pageTitle="FAQ">
        <div id="faq-page">
            <h1>Frequently Asked Questions</h1>
            <p className="faq-description">
                We are a group of volunteers helping Massachusetts residents get
                vaccinated. Our site uses a mix of automated and crowdsourced
                data to show vaccine appointment availability. VaccinateMA
                launched on January 17, 2021.
            </p>
            <h2>Why are you doing this? Isn’t there a state site?</h2>
            <p>
                Although Massachusetts is ~10th out of 50 states in percentage
                of doses administered{' '}
                <a
                    href="https://www.nytimes.com/interactive/2020/us/covid-19-vaccine-doses.html"
                    target="_blank"
                    rel="noreferrer"
                >
                    according to the CDC
                </a>
                , the state is still lagging behind in terms of distributing the
                doses we have been allocated. We&apos;ve found that the{' '}
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
                across the state, which sometimes results in our website having
                locations not listed elsewhere.
            </p>
            <h2>Why is your data out of date?</h2>
            <p>
                Most of our availability information is gathered by hand by a
                group of dedicated volunteers. Some sites only get updated once
                a day -- the time at which the data was last updated can be
                found under &quot;last updated.&quot; We encourage you to check{' '}
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
                for other updated sources of availability.
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
