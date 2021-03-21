import React from 'react';
import Map from '../components/subcomponents/Map';
import PropTypes from 'prop-types';

const ResultsModal = ({hideModal}) => (
    <div className="modal">
        <div className="modal-content">
            <div>
                <Map rawSiteData={[]}/>
            </div>
            <div>
                Address
            </div>
            <div>
                To book an appointment
            </div>
            <div>
                Site details etc
            </div>
            <button onClick={hideModal}>
                Hide me!
            </button>
        </div>
    </div>
);

ResultsModal.propTypes = {
    hideModal: PropTypes.bool
};

export default ResultsModal;