import React, { useState } from 'react';

import Layout from '../../components/Layout';
import VolunteerAuth from '../../components/subcomponents/VolunteerAuth';
import Link from 'next/link';
import VolunteerTable from '../../components/VolunteerTable';
import SitesTable from '../../components/SitesTable';

const Volunteer = () => {
    const [user, setUser] = useState(null);

    const renderContent = () => {
        if (user) {
            const isAdmin = user.role === 'admin';
            return (
                <div>
                    <h1>{`${isAdmin ? 'Administrator' : 'Volunteer'} Portal`}</h1>
                    <p>{`Welcome ${user.firstname}!`}</p>
                    <h2>Resources</h2>
                    <Link href="/volunteer/updater">Site Availability Form</Link>
                    {isAdmin && <VolunteerTable />}
                    {isAdmin && <SitesTable />}
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