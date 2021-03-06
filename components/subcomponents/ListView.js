import React from 'react';
import PropTypes from 'prop-types';

import SearchResult from '../SearchResult';
import parseURLsInStrings from '../utilities/parseURLsInStrings';
import {dateToString} from '../utilities/date-utils';

const ListView = (props) => {
    return (
        <div>
            {props.rawSiteData.map((site, i) => {
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
            })}
        </div>
    );
};

export default ListView;

ListView.propTypes = {
    // The raw site data should be JSON. Improve the type checking here!
    rawSiteData: PropTypes.any.isRequired,
};
