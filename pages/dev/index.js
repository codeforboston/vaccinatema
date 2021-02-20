import React from 'react';

import Layout from '../../components/Layout';
import Map from '../../components/Map';

const Home = () => (
    <Layout pageTitle="Home">
        <div>
            <div className="jumbotron">
                <h2>COVID-19 Vaccine Availability</h2>
                <p className="lead">For <a href="/eligibility"> eligible individuals </a>, find an appointment from the map below or</p>
                <div className="btn-group" style={{width: '100%', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <a className="btn btn-success"  data-toggle="modal" href="/search" style={{justifyContent: 'center'}}>Find Locations Near You</a>
                </div>
        
            </div>
            <Map />
            <br />
            <p> <b> Red star: </b> Mass Vaccination Sites (high volume, large venue sites) </p>
            <p> <b> Green star: </b> General Vaccination Sites (healthcare locations) </p>
            <p> <b> Blue star: </b> Local Vaccination Site (open to select cities/towns) </p>
            <p> <b> Gray dot: </b> No availability currently </p>
        </div>
    </Layout>
);

export default Home;
