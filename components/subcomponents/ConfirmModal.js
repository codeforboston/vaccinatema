import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import PropType from 'prop-types';


const ConfirmModal = ({ isOpen, onClose, action, type }) => (
    <Modal classaName="confirm-modal" show={isOpen} onHide={onClose}>
        <Modal.Header>
            <Modal.Title>{`Delete ${type}`}r</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>{`Are you sure you want to delete this ${type}? This action cannot be undone.`}</p>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={onClose}>Cancel</Button>
            <Button className="delete-danger" onClick={action}>Delete</Button>
        </Modal.Footer>
    </Modal>
);

export default ConfirmModal;
ConfirmModal.propTypes = {
    action: PropType.func,
    isOpen: PropType.bool,
    onClose: PropType.func,
    type: PropType.string,
};