import React from 'react';

import Button from '../components/subcomponents/Button';
import Layout from '../components/Layout';
import SearchResult from '../components/SearchResult';
import parseURLsInStrings from '../components/utilities/parseURLsInStrings';

const ALL_AVAILABIITY = 'All known vaccination sites';
const AVAILABLE_ONLY = 'Sites with reported doses';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.siteDataResultsRef = React.createRef();
    }

    state = {
        siteData: [],
        address: '',
        availability: AVAILABLE_ONLY,
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
            siteDetails:
            (site.fields['Serves'] &&
                parseURLsInStrings(site.fields['Serves'])) ??
            '',
            availability:
                (site.fields['Availability'] &&
                    parseURLsInStrings(site.fields['Availability'])) ??
                'None',
            lastChecked:
                (site.fields['Last Updated'] &&
                    this.parseDate(site.fields['Last Updated'])) ??
                '',
            bookAppointmentInfo:
                (site.fields['Book an appointment'] &&
                    parseURLsInStrings(site.fields['Book an appointment'])) ??
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

    onAvailabilityChange = () => {
        this.setState({
            availability:
                this.state.availability === AVAILABLE_ONLY
                    ? ALL_AVAILABIITY
                    : AVAILABLE_ONLY,
        });
    };


    render() {
        const { renderSiteData, handleEnter } = this;

        return (
            <Layout pageTitle="Search">
                <div className="search-header">
                    <div className="search-header-contents">
                        <span>
                            <div className="search-header-col">
                                <p>City, Town, or ZIP</p>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={this.state.address}
                                    onChange={this.handleChange}
                                    onKeyDown={handleEnter}
                                />
                            </div>
                            <div className="search-header-col options">
                                <p>Other options</p>
                                <label htmlFor="no-availability">
                                    <input
                                        type="checkbox"
                                        id="no-availability"
                                        value={
                                            this.state.availability ===
                                            AVAILABLE_ONLY
                                        }
                                        onChange={this.onAvailabilityChange}
                                    />
                                    Show sites that don&apos;t have availability
                                </label>
                            </div>
                        </span>
                        <span>
                            <div className="search-header-col">
                                <Button
                                    title="Search"
                                    color="blue"
                                    icon="search"
                                    onClick={this.searchByAddress}
                                />
                            </div>
                            <div className="search-header-col">
                                <Button
                                    title="Use my location"
                                    color="blue"
                                    icon="location"
                                    onClick={this.searchByGeolocation}
                                />
                            </div>
                        </span>
                    </div>
                    <div className="error">
                        {this.state.addressError && (
                            <p>City or ZIP code cannot be blank.</p>
                        )}
                        {this.state.geolocationError && (
                            <p>Cannot figure out your location.</p>
                        )}
                    </div>
                </div>
                {renderSiteData()}
            </Layout>
        );
    }
}

export default Search;
