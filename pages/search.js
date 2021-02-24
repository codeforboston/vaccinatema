import React from 'react';

import Layout from '../components/Layout';
import SearchResult from '../components/SearchResult';
import parseBookAppointmentString from '../components/utilities/parseBookAppointmentString';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.siteDataResultsRef = React.createRef();
    }

    state = {
        siteData: [],
        address: '',
        availability: 'Sites with reported doses',
        addressError: false,
        geolocationError: false
    }

    searchByAddress = () => {
        this.setState({addressError: false, geolocationError: false});
        if (this.state.address) {
            this.getLocationData({ availability: this.state.availability, address: this.state.address });
        } else {
            this.setState({addressError: true});
        }
    }

    searchByGeolocation = () => {
        this.setState({addressError: false, geolocationError: false});
        if ('geolocation' in navigator) {
            this.getLatitudeAndLongitudeByGeolocation()
                .then(position => this.getLocationData({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    availability: this.state.availability
                }))
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

    getLocationData = (args) => {
        return fetch('/search_query_location', {
            method: 'post',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({ ...args })
        })
            .then(response => response.json())
            .then(data => this.parseLocationData(data))
            .then(siteData => this.setState({siteData}))
            .then(() => this.siteDataResultsRef.current.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'}))
            .catch(error => {
                console.log(error);
            });
    }

    parseLocationData = (data) => {
        return data.map((site) => ({
            name: site.fields['Location Name'] ?? '',
            address: site.fields['Full Address'] ?? '',
            siteDetails: site.fields['Serves'] ?? '',
            availability:
                (site.fields['Availability'] &&
                    parseBookAppointmentString(site.fields['Availability'])) ??
                'None',
            lastChecked:
                (site.fields['Last Updated'] &&
                    this.parseDate(site.fields['Last Updated'])) ??
                '',
            bookAppointmentInfo:
                (site.fields['Book an appointment'] &&
                    parseBookAppointmentString(
                        site.fields['Book an appointment']
                    )) ??
                '',
        }));
    };
    parseDate = dateString => (
        new Date(Date.parse(dateString)).toLocaleString('en-US', {timeZone: 'America/New_York'})
    )

    handleEnter = (event) => {
        const { searchByAddress } = this;

        if (event.keyCode === 13) {
            // If a user presses Enter, trigger search
            searchByAddress();
        }
    };

    renderSiteData = () => {
        const { siteData } = this.state;

        if (siteData.length > 0) {
            const sites = siteData.map( (site, i) => {
                return (
                    <div key={i}>
                        <SearchResult {...site} />
                    </div>
                );
            });

            return (
                <div>
                    <h2>Results</h2>
                    <ul id="sites" className="list-group" ref={this.siteDataResultsRef}>
                        {sites}
                    </ul>
                </div>
            );
        }
    };

    render() {
        const { renderSiteData, handleEnter } = this;

        return (
            <Layout pageTitle="Search">
                <div className= "jumbotron bg-white">
                    <h1>Search Near Me</h1>
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
                                    <label htmlFor="address">or near</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        placeholder="City, town, or zip code"
                                        required=""
                                        value={this.state.address}
                                        onChange={this.handleChange}
                                        onKeyDown={handleEnter}
                                    />
                                </div>
                                {this.state.addressError && <p>City or zip code cannot be blank</p>}
                                <button onClick={this.searchByAddress} id="signup" className="btn btn-primary">Search</button>
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
