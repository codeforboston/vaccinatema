import React from 'react';

import Layout from '../../components/Layout';
import EmailLink from '../../components/subcomponents/EmailLink';
import PressTile from '../../components/subcomponents/PressTile';

const Press = () => {

    // TODO: fetch press links from API
    const pressPackage = [
        {
            name: 'Boston Globe',
            title: 'Another coder has built a COVID vaccine appointment website for Mass. residents',
            link: 'https://www.bostonglobe.com/2021/02/08/business/another-coder-has-built-covid-vaccine-appointment-website-mass-residents/'
        }, {
            name: 'Vice',
            title: 'The COVID Vaccine Rollout Has Been So Chaotic People Are Making Their Own Websites to Find Appointments',
            link: 'https://www.vice.com/en/article/wx8kv5/private-citizens-are-trying-to-make-it-easier-to-get-a-covid-vaccine-appointment'
        }, {
            name: 'Harvard GSAS',
            title: 'Bringing Vaccination Online',
            link: 'https://gsas.harvard.edu/news/stories/bringing-vaccination-online'
        }, {
            name: 'WCVB',
            title: 'Volunteers create alternative listing of COVID-19 vaccination sites in Massachusetts',
            link: 'https://www.wcvb.com/article/volunteers-create-alternative-listing-of-covid-19-vaccination-sites-in-massachusetts/35462794'
        }, {
            name: 'Framingham Source',
            title: 'Framingham High Graduates Helping People Book COVID Vaccines Through VaccinateMA.com Website',
            link: 'https://framinghamsource.com/index.php/2021/02/10/framingham-high-graduates-helping-people-book-covid-vaccines-through-vaccinatema-com-website/'
        },
    ];

    const pressLinks = pressPackage.map(item => {
        return (
            <PressTile key={item.name}
                name={item.name}
                title={item.title}
                link={item.link}
            />
        );
    });

    return (
        <Layout pageTitle="Press">
            <div id="press-page">
                <h2>In the press</h2>
                <p>Are you a reporter and want to contact us? Shoot us an email at{' '}<EmailLink/>.</p>
                {pressLinks}
            </div>
        </Layout>
    );
};

export default Press;