import React, {useRef, useEffect} from 'react';
import Map from './subcomponents/Map';
import PropTypes from 'prop-types';
import parseURLsInStrings from './utilities/parseURLsInStrings';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMapMarkerAlt, faTimesCircle} from '@fortawesome/free-solid-svg-icons';

const ResultsModal = ({data, hideModal}) => {
    useEffect(() => {
        document.addEventListener('click', handleOutsideClick, false);
        return () => {
            document.removeEventListener('click', handleOutsideClick, false);
        };
    }, []);
    const modalRef = useRef();
    const handleOutsideClick = (e) => {
        const target = e.target;
        if (!modalRef.current.contains(target)) {
            hideModal();
        }
    };
    return (
        <div className="modal">
            <div className="modal-content" ref={modalRef}>
                <div>
                    <Map
                        rawSiteData={[data]}
                        center={{lat: data.latitude, lng: data.longitude}}
                        zoom={12}
                        setPopupData={() => {}}
                        onMapChange={() => {}}
                    />
                </div>
                <div>
                    <center>
                        <button onClick={hideModal}>
                            <FontAwesomeIcon icon={faTimesCircle} />{' '} Close Modal
                        </button>
                    </center>
                </div>
                <div className="modal-site-name-section">
                    <div className="modal-section-content">
                        <h4>{data.locationName}</h4>
                        <p className="modal-site-address-text">
                            {data.address}{' '}
                            <FontAwesomeIcon icon={faMapMarkerAlt} />{' '}
                            <a
                                href={
                                    'https://www.google.com/maps/place/' +
                                    data.address
                                }
                            >
                                Get directions
                            </a>
                        </p>
                    </div>
                </div>
                <div className="modal-book-appointment-section">
                    <div className="modal-section-content">
                        <h3>To book an appointment</h3>
                        <p className="modal-book-appointment-text">
                            {parseURLsInStrings(data.bookAppointmentInformation)}
                        </p>
                    </div>
                </div>
                <div>
                    <div className="modal-section-content">
                        <p className="modal-section-header">Serves</p>
                        <p className="modal-text">{data.populationsServed}</p>
                        <p className="modal-section-header">Availability</p>
                        <p className="modal-text">{data.vaccineAvailability}</p>
                        <p className="modal-section-header">
                            Instructions at site
                        </p>
                        <p className="modal-text">{data.instructionsAtSite}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

ResultsModal.propTypes = {
    hideModal: PropTypes.func.isRequired,
    data: PropTypes.shape({
        id: PropTypes.string.isRequired,
        locationName: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        populationsServed: PropTypes.string.isRequired,
        vaccineAvailability: PropTypes.string.isRequired,
        lastUpdated: PropTypes.number.isRequired,
        bookAppointmentInformation: PropTypes.string.isRequired,
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        instructionsAtSite: PropTypes.string.isRequired,
        sitePinShape: PropTypes.string.isRequired,
    }).isRequired,
};

export default ResultsModal;
