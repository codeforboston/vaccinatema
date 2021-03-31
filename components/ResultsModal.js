import React, {useRef} from 'react';
import Map from './subcomponents/Map';
import PropTypes from 'prop-types';
import parseURLsInStrings from './utilities/parseURLsInStrings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const ResultsModal = React.forwardRef(({data, hideModal}, ref) => (
    <div className="modal">
        <div className="modal-content" ref={ref}>
            <div>
                <Map 
                    rawSiteData={[data]}
                    coordinates={{lat: data.latitude, lng: data.longitude}}
                    defaultZoom={12}
                />
            </div>
            <div className="modal-site-name-section">
                <div className="modal-section-content">
                    <h4>{data.name}</h4>
                    <p className="modal-site-address-text">{data.address} <FontAwesomeIcon icon={faMapMarkerAlt} /> <a href={'https://www.google.com/maps/place/' + data.address}>Get directions</a></p>
                </div>
            </div>
            <div className="modal-book-appointment-section">
                <div className="modal-section-content">
                    <h3>To book an appointment</h3>
                    <p className="modal-book-appointment-text">{parseURLsInStrings(
                        data.bookAppointmentInfo,
                    )}</p>
                </div>
            </div>
            <div>
                <div className="modal-section-content">
                    <p className="modal-section-header">Serves</p>
                    <p className="modal-text">
                        {data.serves}
                    </p>
                    <p className="modal-section-header">Availability</p>
                    <p className="modal-text">
                        {data.availability}
                    </p>
                    <p className="modal-section-header">Instructions at site</p>
                    <p className="modal-text">
                        {data.instructionsAtSite}
                    </p>
                </div>
            </div>
            <button onClick={hideModal}>
                Hide me!
            </button>
        </div>
    </div>
));

ResultsModal.propTypes = {
    hideModal: PropTypes.func,
    data: PropTypes.shape(
        {
            id: PropTypes.string,
            name: PropTypes.string,
            address: PropTypes.string,
            serves: PropTypes.string,
            availability: PropTypes.string,
            lastUpdated: PropTypes.number,
            bookAppointmentInfo: PropTypes.string,
            latitude: PropTypes.number,
            longitude: PropTypes.number,
            instructionsAtSite: PropTypes.string,
        }
    ),
};

export default ResultsModal;
