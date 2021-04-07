import React from 'react';

import Layout from '../components/Layout';
import EmailLink from '../components/subcomponents/EmailLink';
import PressTile from '../components/subcomponents/PressTile';

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
        }, {
            name: 'The Verge',
            title: 'How to score a COVID-19 vaccine appointment',
            link: 'https://theverge.com/22279023/covid-19-vaccine-appointment-how-to',
        }, {
            name: 'El Planeta',
            title: 'Diseñan sitios web de citas para la vacuna COVID-19 en MA',
            link: 'https://elplaneta.com/news/2021/feb/10/disenan-sitios-web-citas-para-vacuna-covid-massachusetts',
        }, {
            name: 'YourArlington',
            title: 'Vaccine site by on-leave engineer keeps going',
            link: 'https://yourarlington.com/arlington-archives/town-school/town-news/health/18329-shots-020721.html',
        }, {
            name: 'Code for America',
            title: 'February Brigade Project Standup: VaccinateMA.com, Public Utility Data, Brigade Project Index',
            link: 'https://www.youtube.com/embed/jehr59QzQBo?start=208&end=1470',
        }
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
                <h1>In the Press</h1>
                <p>
                    Are you a reporter and want to contact us? Shoot us an email
                    at <EmailLink />.
                </p>
                {pressLinks}
            </div>
        </Layout>
    );
};

export default Press;
