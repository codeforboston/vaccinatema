// TODO: Rename this index.js when react migration is complete
import React from 'react';

import Layout from '../../components/Layout';
import UpdaterForm from '../../components/UpdaterForm';

const Updater = () => (
    <Layout pageTitle="Site Availability Updater">
        <div id="updater-page">
            <h1>Site availability updater</h1>
            <h6>Use this form to update the availability of one of the sites</h6>
            <UpdaterForm />
        </div>
    </Layout>
);

export default Updater;