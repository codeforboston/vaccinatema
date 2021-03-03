import React, { useState } from 'react';

import Layout from '../../components/Layout';
import UpdaterForm from '../../components/UpdaterForm';
import VolunteerAuth from '../../components/subcomponents/VolunteerAuth';

const Updater = () => {
    const [user, setUser] = useState(null);

    const renderContent = () => {
        if (user) {
            return (
                <div>
                    <h1>Site availability updater</h1>
                    <p>Choose a site from the list and follow the prompts to update availability.</p>
                    <UpdaterForm />
                </div>
            );
        }
    };

    // TODO: name the user, pass the user down to the form
    return (
        <Layout pageTitle="Site Availability Updater">
            <div id="updater-page">
                <VolunteerAuth sendUser={setUser}/>
                {renderContent()}
            </div>
        </Layout>
    );
};

export default Updater;