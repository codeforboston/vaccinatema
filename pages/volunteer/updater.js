import React from 'react';

import Layout from '../../components/Layout';
import UpdaterForm from '../../components/UpdaterForm';

const Updater = () => (
    <Layout pageTitle="Site Availability Updater">
        <div id="updater-page">
            <h1>Site availability updater</h1>
            <p>Choose a site from the list and follow the prompts to update availability.</p>
            <UpdaterForm />
        </div>
    </Layout>
);

export default Updater;