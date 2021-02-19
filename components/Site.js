import React from 'react';
import PropType from 'prop-types';

import Pin from './Pin';

const Site = ({data}) => (
  <li className="list-group-item">
    <h4>{data.locationName}</h4>
    <div>
      <div className="site_address mb-2 flex flex-row items-center">
        <Pin />
        <a id="site_address_1" className="underline" href={'https://maps.google.com/?q=' + data.address} target="_blank" rel="noreferrer">{data.address}</a>
      </div>
      <div>
        <div id="latest_report_1">Latest report: {data.lastUpdated}</div>
        <dt>Details</dt>
        <dd id="details_1">{data.populationsServed}</dd>
        <dt>Availability</dt>
        <dd id="latest_info_1">{data.vaccineAvailability}</dd>
        <dt>Book Now</dt>
        <dd id="book_1">{data.bookAppointmentInformation}</dd>
      </div>
    </div>
  </li>
);

export default Site;

Site.propTypes = {
  data: {
    address: PropType.string,
    lastUpdated: PropType.string,
    populationsServed: PropType.string,
    vaccineAvailability: PropType.string,
    bookAppointmentInformation: PropType.string,
  },
};
