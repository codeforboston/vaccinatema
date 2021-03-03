import React from 'react';

import Layout from '../components/Layout';
import parseURLsInStrings from '../components/utilities/parseURLsInStrings';
import SearchBar from '../components/SearchBar';
import SearchResult from '../components/SearchResult';
import {dateToString} from '../components/utilities/date-utils';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.siteDataResultsRef = React.createRef();
    }

    state = {
        siteData: [],
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
            name: site.name,
            address: site.address,
            siteDetails: parseURLsInStrings(site.serves),
            availability: site.availability && parseURLsInStrings(site.availability),
            lastChecked: dateToString(site.lastUpdated),
            bookAppointmentInfo: parseURLsInStrings(site.bookAppointmentInfo),
        }));
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
        const {getLocationData, renderSiteData} = this;
        return (
            <Layout pageTitle="Search">
                <SearchBar onSearch={getLocationData} />
                {renderSiteData()}
            </Layout>
        );
    }
}

export default Search;
