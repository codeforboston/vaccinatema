import React, {useState} from 'react';
import Modal from '../components/ResultsModal';

// For development purposes only
// Demonstrates how to show/hide a results modal
// and pass the expected data structure to it
const ModalTestPage = () => {
    const [showModal, setShowModal] = useState(false);
    const triggerModalChange = () => {
        setShowModal(!showModal);
    };
    return (
        <div>
            <button onClick={triggerModalChange}>Click me!</button>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <div>
                {showModal && <Modal data={
                    {
                        id: '1',
                        name: 'Location name!',
                        address: '1 north main st, webster, ma',
                        serves: 'Populations served are many',
                        availability: 'it is available',
                        lastUpdated: '2021-03-05',
                        bookAppointmentInfo: 'Info for booking appointment is such and such',
                        latitude: 42.054208,
                        longitude: -71.87868,
                        instructionsAtSite: 'Here are some instructions',
                    }
                } hideModal={triggerModalChange}/>}
            </div>
        </div>
    );
};

export default ModalTestPage;
