import React, {useState} from 'react';
import Modal from '../components/ResultsModal';

const ModalPage = () => {
    const [showModal, setShowModal] = useState(false);
    const triggerModalChange = () => {
        setShowModal(!showModal);
    };
    return (
        <div>
            {showModal && <Modal data={
                {
                    id: '1',
                    name: 'Location name!',
                    address: '1 north main st, webster, ma',
                    serves: 'Populations served are many',
                    availability: 'it is available',
                    lastUpdated: '2021-03-05',
                    bookAppointmentInfo: 'Info for booking appointment',
                    latitude: 42.054208,
                    longitude: -71.87868,
                }
            } hideModal={triggerModalChange}/>}
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
            <p>text</p>
        </div>
    );
};

export default ModalPage;
