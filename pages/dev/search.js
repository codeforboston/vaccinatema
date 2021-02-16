import React from 'react'
import Layout from "../../components/Layout"
import Site from '../../components/Site'
import Geocode from "react-geocode";

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.siteDataResultsRef = React.createRef()  
    }

    state = {
        siteData: [],
        zipCode: "",
        availability: "Sites with reported doses",
        zipCodeError: false,
        geolocationError: false
    }

    searchByZipCode = e => {
        this.setState({zipCodeError: false, geolocationError: false})
        if (/^\d{5}$/.test(this.state.zipCode)) {
            this.getLatitudeAndLongitudeByZipcode(this.state.zipCode)
                .then(data => this.getLocationData(data.latitude, data.longitude, this.state.availability))
            
        } else {
            this.setState({zipCodeError: true})
        }
    }

    getLatitudeAndLongitudeByZipcode = zipCode => {
        Geocode.setApiKey("AIzaSyDxF3aT2MwmgzcAzFt5PtB-B3UNp4Js2h4");
        return Geocode.fromAddress(zipCode).then(
            (response) => {
                const { lat, lng } = response.results[0].geometry.location;
                return {
                    latitude: lat,
                    longitude: lng
                }
            },
            (error) => {
                console.error(error);
            }
        )
    }

    searchByGeolocation = e => {
        this.setState({zipCodeError: false, geolocationError: false})
        if ("geolocation" in navigator) {
            this.getLatitudeAndLongitudeByGeolocation()
                .then(position => this.getLocationData(position.coords.latitude, position.coords.longitude, this.state.availability))
                .catch(error => {
                    console.error(error);
                });
        } else {
            this.setState({geolocationError: true})
        }
    }

    getLatitudeAndLongitudeByGeolocation = () => {
        return new Promise((resolve, reject) => 
            navigator.geolocation.getCurrentPosition(resolve, reject)
        );
    }

    handleChange = e => {
        const target = e.target
        const newState = {}
        newState[target.name] = target.value
        this.setState(newState)
    }

    getLocationData = (latitude, longitude, availability) => {
        return fetch('/search_query_location', {
            method: 'post',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({
                latitude,
                longitude,
                availability
            })
        })
            .then(response => response.json())
            .then(data => this.parseLocationData(data))
            .then(siteData => this.setState({siteData}))
            .then(() => this.siteDataResultsRef.current.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"}))
            .catch(error => {
                console.log(error);
            });
    }

    parseLocationData = data => {
        return data.map( site => (
            {
                locationName: site.fields["Location Name"],
                address: site.fields["Full Address"],
                populationsServed: site.fields["Serves"],
                vaccineAvailability: site.fields["Availability"],
                lastUpdated: this.parseDate(site.fields["Last Updated"]),
                bookAppointmentInformation: site.fields["Book an appointment"]
            }
        ))
    }

    parseDate = dateString => (
        new Date(Date.parse(dateString)).toLocaleString('en-US', {timeZone: "America/New_York"})
    )

    render() {
        return (
            <Layout pageTitle="Search">
                <div className= "jumbotron">
                    <h2>Search Near Me</h2>
                    <p className="lead">We check the availability of every provider found on the <a href=""> state website</a></p>
                    <div className= "container">
                        <div className= "row">
                            <div className="relative max-w-xs">
                                    <div className="form-group">
                                        <label for="type">Find </label>
                                        <select value={this.state.availability} onChange={this.handleChange} className="form-control" name="availability" id="availability" >
                                            <option value="Sites with reported doses">Sites with reported doses</option>
                                            <option value="All known vaccination sites">All known vaccination sites</option>
                                        </select>
                                    </div>
                                    <p> near </p>
                                    <button id="geolocate" onClick={this.searchByGeolocation} className="btn btn-primary">My Location</button>
                                    {this.state.geolocationError && <p>Cannot figure out your location. Please enter your zip code instead.</p>}
                                    <div className="form-group">
                                        <span> or near</span>
                                        <input type="text" className="form-control" id="zipCode" name="zipCode" placeholder="5-digit zip code" required="" value={this.state.zipCode} onChange={this.handleChange} />
                                    </div>
                                    {this.state.zipCodeError && <p>Zip code is not valid!</p>}
                                    <button onClick={this.searchByZipCode} id="signup" className="btn btn-primary">Search By Zip Code</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ul id="sites" className="list-group" ref={this.siteDataResultsRef}>
                    {
                        this.state.siteData
                        &&
                        this.state.siteData.map( (site) => (
                            <div>
                                <Site data={site} />
                            </div>
                        ))
                    }
                </ul>
            </Layout>
        )
    }
}

export default Search;
