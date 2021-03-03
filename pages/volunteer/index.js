import React, { useState } from 'react';

import Layout from '../../components/Layout';
import VolunteerAuth from '../../components/subcomponents/VolunteerAuth';

const Volunteer = () => {
    const [user, setUser] = useState(null);

    const renderContent = () => {
        if (user) {
            return (
                <div>
                    <h1>{`Welcome ${user?.firstName}!`}</h1>
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