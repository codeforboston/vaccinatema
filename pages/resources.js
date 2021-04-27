import React from 'react';

import Layout from '../components/Layout';
import Link from '../components/subcomponents/Link';

const Resources = () => (
    <Layout pageTitle="Resources">
        <div id="resources-page">
            <h1>Resources</h1>
            <h2>Finding an appointment</h2>
            <p>
                <p>
                    In addition to using our map, list, and search
                    functionalities, you can use the following resources to find
                    an appointment:
                </p>
                <ul>
                    <li>
                        Make sure you have signed up with the Massachusetts
                        vaccine preregistration system:{' '}
                        <Link href={'https://vaccinesignup.mass.gov'}>
                            https://vaccinesignup.mass.gov
                        </Link>
                        .
                    </li>
                    <li>
                        Check the Twitter bot{' '}
                        <Link href={'https://twitter.com/vaccinetime'}>
                            @vaccinetime
                        </Link>{' '}
                        and set up notifications if you have a Twitter account.
                        It posts automatically when appointments are released.
                    </li>
                    <li>
                        Look at another volunteer-run site{' '}
                        <Link href={'https://macovidvaccines.com'}>
                            MA COVID Vaccines
                        </Link>
                        .
                    </li>
                    <li>
                        You can also contact{' '}
                        <Link href={'https://macovidvaxhelp.com'}>
                            MA COVID Vax Help
                        </Link>
                        , which is a volunteer project that registers people for
                        a vaccine.
                    </li>
                    <li>
                        If you have difficulty using the Internet, you can call
                        211 (TTY (508) 370-4890) for the MA vaccine hotline,
                        which is available 24/7, and they can register you for
                        an appointment.
                    </li>
                </ul>
            </p>

            <h2>Getting to the appointment</h2>
            <p>
                There are a number of programs to help people get transportation
                to and from their COVID vaccine appointments. If you have health
                insurance under Medicaid, Medicare Advantage, or Veteran Affairs
                (VA), your plan may provide benefits for non-emergency
                transportation.
            </p>
            <p>
                People with MassHealth or Health Safety Net coverage can get{' '}
                <Link
                    href={
                        'https://mailchi.mp/bostoncil/transportation-services-to-covid-19-vaccine-appointments'
                    }
                >
                    free rides
                </Link>
                .
            </p>
            <p>
                People getting vaccines in Arlington, Boston, Brookline,
                Cambridge, Chelsea, Everett, Newton, Revere, Somerville and
                Watertown can get{' '}
                <Link
                    href={
                        'https://www.wcvb.com/article/residents-eligible-for-free-bluebikes-rides-to-get-vaccine/36162183'
                    }
                >
                    two days of unlimited Bluebike rides
                </Link>{' '}
                (one for each dose) with the codes BLUEVAX1 and BLUEVAX2.
            </p>
            <p>
                Residents of Berkshire County with disabilities can get free
                taxi rides with County Rainbow Taxi (CRT) to their appointments.
                If interested, please call AdLib’s Warm Line at 413-281-7328.
            </p>
            <p>
                Lyft has partnered with nonprofits in certain areas of
                Massachusetts to provide free rides to/from appointments. Fill
                out the{' '}
                <Link href={'https://lyftup.typeform.com/to/k6xYpwVV'}>
                    screening form
                </Link>{' '}
                to see if there are services near you. Right now, Worcester
                residents should email{' '}
                <Link href={'mailto:meghan.maceiko@unitedwaycm.org'}>
                    meghan.maceiko@unitedwaycm.org
                </Link>
                .
            </p>
            <p>
                See this{' '}
                <Link
                    href={
                        'https://www.mass.gov/service-details/health-care-transportation'
                    }
                >
                    Mass.gov webpage
                </Link>{' '}
                for more resources on transportation for medical reasons.
            </p>

            <h2>After the appointment</h2>
            <p>
                Be sure to take a photograph or scan of the front and back of
                your CDC vaccination card after all doses. The card provides
                important information for your health record. If you lose the
                card, contact the original location where you got the shot. Make
                sure to bring the card to your second appointment, too.
            </p>
            <p>
                If you&apos;d like to contribute data on vaccine side effects,
                download the{' '}
                <Link
                    href={
                        'https://www.cdc.gov/coronavirus/2019-ncov/vaccines/safety/vsafe.html'
                    }
                >
                    V-safe smartphone app
                </Link>{' '}
                from the CDC. It will send you personalized check-ins after
                vaccination and remind you when it&apos;s time to get your
                second dose (if applicable). Alternatively, you can report side
                effects through{' '}
                <Link href={'https://vaers.hhs.gov/reportevent.html'}>
                    Vaccine Adverse Event Reporting System (VAERS)
                </Link>
                .
            </p>

            <h2>
                Special groups (minors, seniors, people who are homebound,
                veterans)
            </h2>
            <h3>Minors</h3>
            <p>
                People aged 16 and 17 are only eligible to receive the Pfizer
                vaccine at this time. You must obtain guardian permission on a{' '}
                <Link
                    href={
                        'https://www.mass.gov/lists/ma-consent-and-screening-forms-for-people-under-18-years-of-age'
                    }
                >
                    consent form
                </Link>
                , which you can bring to the appointment. The guardian does not
                have to be present at the appointment.
            </p>
            <h3>Seniors</h3>
            <p>
                To find a ride to your vaccine appointment, seniors should
                contact your local{' '}
                <Link href={'https://mcoaonline.com'}>Council on Aging</Link>{' '}
                or, if enrolled, your Program of All-Inclusive Care for the
                Elderly (PACE).
            </p>
            <h3>People who are homebound</h3>
            <p>
                From the Massachusetts State{' '}
                <Link
                    href={
                        'https://www.mass.gov/info-details/covid-19-homebound-vaccination-program'
                    }
                >
                    website
                </Link>
                :
                <br />
                <br />
                <p>
                    In-home vaccinations are available for homebound people who
                    are not able to leave their home to get to a vaccination
                    site, even with assistance. These individuals either:
                </p>
                <ul>
                    <li>
                        Have considerable difficulty and/or require significant
                        support to leave the home for medical appointments
                    </li>
                    <li>
                        Require ambulance or two-person assistance to leave the
                        home
                    </li>
                    <li>
                        Are not able to leave the home for medical appointments
                        under normal circumstances
                    </li>
                </ul>
                If you or someone you know qualifies for in-home vaccination,
                please call the Homebound Vaccination Central Intake Line at
                (833) 983-0485 Monday through Friday from 9:00 AM to 5:00 PM.
                Representatives are available in both English and Spanish, and
                also have access to translators for over 100 languages.
            </p>
            <h3>Veterans</h3>
            <p>
                There are often clinics specifically for veterans and their
                spouses and caregivers.{' '}
                <Link
                    href={
                        'https://www.va.gov/health-care/covid-19-vaccine/sign-up/service-information'
                    }
                >
                    Register your interest here
                </Link>{' '}
                to be contacted or find out more.
            </p>
            <p>
                <p>
                    The following sites often host walk-in clinics for veterans
                    and relevant individuals under the SAVES act:
                </p>
                <ul>
                    <li>Billerica: Billerica Town Hall</li>
                    <li>Burlington: American Legion Post 273</li>
                    <li>
                        Beverly: Massachusetts Task Force 1 Urban Search and
                        Rescue Team
                    </li>
                    <li>Dracut: Dracut Council on Aging</li>
                    <li>North Andover: VFW</li>
                    <li>Salem: Community Life Center</li>
                    <li>
                        Haverhill: Consentino Middle School (call 781-687-4000
                        to schedule)
                    </li>
                    <li>
                        Bedford: Edith Nourse Rogers Memorial VA Hospital (call
                        781-687-4000 to schedule from 8-4:30 on weekdays)
                    </li>
                </ul>
                Search for them on our site for more information about
                location/eligibility.
            </p>
            <p>
                Especially for transportation to/from VA centers, veterans
                should take a look at ride resources on{' '}
                <Link
                    href={
                        'https://www.mass.gov/service-details/veterans-transportation'
                    }
                >
                    this page
                </Link>
                .
            </p>
        </div>
    </Layout>
);

export default Resources;
