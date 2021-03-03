import React from 'react';

import Layout from '../components/Layout';
import MapAndListView from '../components/MapAndListView';

const Home = () => (
    <Layout pageTitle="Home">
        <div>
            <div className="jumbotron bg-white">
                <h2>COVID-19 Vaccine Availability</h2>
                <p className="lead">For <a href="/eligibility">eligible individuals</a>, find an appointment from the map below or</p>
                <div className="btn-group" style={{width: '100%', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <a className="btn btn-success"  data-toggle="modal" href="/search" style={{justifyContent: 'center'}}>Find Locations Near You</a>
                </div>
        
            </div>
            <MapAndListView />
        </div>
    </Layout>
);

export default Home;
