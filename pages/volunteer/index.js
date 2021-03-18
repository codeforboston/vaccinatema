import React, { useState } from 'react';

import Layout from '../../components/Layout';
import VolunteerAuth from '../../components/subcomponents/VolunteerAuth';
import Link from 'next/link';
import VolunteerTable from '../../components/VolunteerTable';
import SitesTable from '../../components/SitesTable';

/*
    Data for volunteers and sites are stored in this top level component,
    but fetched and managed within each table component
 */

const Volunteer = () => {
    const [user, setUser] = useState(null);
    const [sites, setSites] = useState([]);
    const [volunteers, setVolunteers] = useState([]);

    const renderContent = () => {
        if (user) {
            const isAdmin = user.role === 'admin';
            return (
                <div>
                    <h1>{`${isAdmin ? 'Administrator' : 'Volunteer'} Portal`}</h1>
                    <p>{`Welcome ${user.firstname}!`}</p>
                    <h2>Resources</h2>
                    <Link href="/volunteer/updater">Site Availability Form</Link>
                    {
                        isAdmin &&
                        <VolunteerTable
                            sites={sites}
                            volunteers={volunteers}
                            setVolunteers={setVolunteers}
                        />
                    }
                    {isAdmin && <SitesTable sites={sites} setSites={setSites}/>}
                </div>
            );
        }
    };

    return (
        <Layout pageTitle="Volunteer Home">
            <div id="volunteer-home">
                <VolunteerAuth sendUser={setUser}/>
                {renderContent()}
            </div>
        </Layout>
    );
};

export default Volunteer;
