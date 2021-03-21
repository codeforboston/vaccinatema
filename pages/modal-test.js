import React, {useState} from 'react';
import Modal from '../components/ResultsModal';

const ModalPage = () => {
    const [showModal, setShowModal] = useState(false);
    const triggerModalChange = () => {
        setShowModal(!showModal);
    };
    return (
        <div>
            {showModal && <Modal hideModal={triggerModalChange}/>}
            <button onClick={triggerModalChange}>Click me!</button>
        </div>
    );
};

export default ModalPage;