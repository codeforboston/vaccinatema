import React from 'react';
import Layout from '../components/Layout';
import Site from '../components/Site';
import parseBookAppointmentString from '../components/utilities/parseBookAppointmentString';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.siteDataResultsRef = React.createRef();  
    }

    state = {
        siteData: [],
        zipCode: '',
        availability: 'Sites with reported doses',
        zipCodeError: false,
        geolocationError: false
    }

    searchByZipCode = () => {
        this.setState({zipCodeError: false, geolocationError: false});
        if (this.state.zipCode) {
            this.getLocationData(null, null, this.state.availability, this.state.zipCode);
        } else {
            this.setState({zipCodeError: true});
        }
    }

    searchByGeolocation = () => {
        this.setState({zipCodeError: false, geolocationError: false});
        if ('geolocation' in navigator) {
            this.getLatitudeAndLongitudeByGeolocation()
                .then(position => this.getLocationData(position.coords.latitude, position.coords.longitude, this.state.availability, null))
                .catch(error => {
                    console.error(error);
                });
        } else {
            this.setState({geolocationError: true});
        }
    }

    getLatitudeAndLongitudeByGeolocation = () => {
        return new Promise((resolve, reject) => 
            navigator.geolocation.getCurrentPosition(resolve, reject)
        );
    }

    handleChange = e => {
        const target = e.target;
        const newState = {};
        newState[target.name] = target.value;
        this.setState(newState);
    }

    getLocationData = (latitude, longitude, availability, zipCode) => {
        return fetch('/search_query_location', {
            method: 'post',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({
                latitude,
                longitude,
                availability,
                zipCode
            })
        })
            .then(response => response.json())
            .then(data => this.parseLocationData(data))
            .then(siteData => this.setState({siteData}))
            .then(() => this.siteDataResultsRef.current.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'}))
            .catch(error => {
                console.log(error);
            });
    }

    parseLocationData = data => {
        return data.map( site => (
            {
                locationName: site.fields['Location Name'] ?? '',
                address: site.fields['Full Address'] ?? '',
                populationsServed: site.fields['Serves'] ?? '',
                vaccineAvailability: site.fields['Availability'] ?? '',
                lastUpdated: (site.fields['Last Updated'] && this.parseDate(site.fields['Last Updated'])) ?? '',
                bookAppointmentInformation: (site.fields['Book an appointment'] && parseBookAppointmentString(site.fields['Book an appointment'])) ?? ''
            }
        ));
    }

    parseDate = dateString => (
        new Date(Date.parse(dateString)).toLocaleString('en-US', {timeZone: 'America/New_York'})
    )
    
    renderSiteData = () => {
        const { siteData } = this.state;

        if (siteData.length > 0) {
            const sites = siteData.map( (site, i) => {
                return (
                    <div key={i}>
                        <Site data={site}/>
                    </div>
                );
            });

            return (
                <div>
                    <h3>Results:</h3>
                    <ul id="sites" className="list-group" ref={this.siteDataResultsRef}>
                        {sites}
                    </ul>
                </div>
            );
        }
    };

    render() {
        const { renderSiteData } = this;
        
        return (
            <Layout pageTitle="Search">
                <div className= "jumbotron bg-white">
                    <h2>Search Near Me</h2>
                    <p className="lead">
                        We check the availability of every provider found on the{' '}
                        <a
                            href="https://vaxfinder.mass.gov"
                            target="_blank"
                            rel="noreferrer"
                        >
                            state website
                        </a>.
                    </p>
                    <div className= "container">
                        <div className= "row">
                            <div className="relative max-w-xs">
                                <div className="form-group">
                                    <label htmlFor="availability">Find</label>
                                    <select value={this.state.availability} onChange={this.handleChange} className="form-control" name="availability" id="availability" >
                                        <option value="Sites with reported doses">Sites with reported doses</option>
                                        <option value="All known vaccination sites">All known vaccination sites</option>
                                    </select>
                                </div>
                                <p> near </p>
                                <button id="geolocate" onClick={this.searchByGeolocation} className="btn btn-primary">My Location</button>
                                {this.state.geolocationError && <p>Cannot figure out your location.</p>}
                                <div className="form-group">
                                    <label htmlFor="zipCode">or near</label>
                                    <input type="text" className="form-control" id="zipCode" name="zipCode" placeholder="city or zip code" required="" value={this.state.zipCode} onChange={this.handleChange} />
                                </div>
                                {this.state.zipCodeError && <p>City or zip code cannot be blank!</p>}
                                <button onClick={this.searchByZipCode} id="signup" className="btn btn-primary">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
                {renderSiteData()}
            </Layout>
        );
    }
}

export default Search;
