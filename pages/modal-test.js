import React, {useState, useRef} from 'react';
import Modal from '../components/ResultsModal';

const ModalTestPage = () => {
    const [showModal, setShowModal] = useState(false);
    React.useEffect(() => {
        if (showModal) {
            document.addEventListener('click', handleOutsideClick, false);
        }
    }, [showModal]);
    const modalRef = useRef();
    const triggerModalChange = () => {
        document.removeEventListener('click', handleOutsideClick, false);
        setShowModal(!showModal);
    };
    const handleOutsideClick = e => {
        const target = e.target;
        if (!modalRef.current.contains(target)) {
            triggerModalChange();
        }
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
                {showModal && <Modal ref={modalRef} data={
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
