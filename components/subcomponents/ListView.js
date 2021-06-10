import React from 'react';
import PropTypes from 'prop-types';

import parseURLsInStrings from '../utilities/parseURLsInStrings';
import SearchResult from '../SearchResult';
import {dateToString} from '../utilities/date-utils';
import AvailabilityBanner from './AvailabilityBanner';

const ListView = (props) => {
    const sitesWithAvailability = props.rawSiteData.filter(
        (site) => site.availability.length > 0
    );
    const sitesWithoutAvailability = props.rawSiteData.filter(
        (site) => site.availability.length === 0
    );

    const siteDataToSearchResult = (site, i) => {
        return (
            <div key={i}>
                <SearchResult
                    name={site.name}
                    address={site.address}
                    siteDetails={parseURLsInStrings(site.serves)}
                    availability={
                        site.availability &&
                        parseURLsInStrings(site.availability)
                    }
                    lastChecked={dateToString(site.lastUpdated)}
                    bookAppointmentInfo={parseURLsInStrings(
                        site.bookAppointmentInfo
                    )}
                />
            </div>
        );
    };

    return (
        <div>
            {sitesWithAvailability.map(siteDataToSearchResult)}
            {sitesWithoutAvailability.length > 0 && (
                <AvailabilityBanner
                    numSites={sitesWithoutAvailability.length}
                    hasAvailability={false}
                />
            )}
            {sitesWithoutAvailability.map(siteDataToSearchResult)}
        </div>
    );
};

export default ListView;

ListView.propTypes = {
    // The raw site data should be JSON. Improve the type checking here!
    rawSiteData: PropTypes.any.isRequired,
};
