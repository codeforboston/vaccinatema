import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import PropType from 'prop-types';

import ConfirmModal from './ConfirmModal';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const VolunteerAddForm = ({ isOpen, onClose, addVolunteer, editing }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [firstName, setFirstname] = useState('');
    const [role, setRole] = useState('volunteer');
    const [lastName, setLastname] = useState('');
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');

    useEffect(() => {
        setError(null);
        if (editing) {
            setFirstname(editing.firstname);
            setLastname(editing.lastname);
            setEmail(editing.email);
            setRole(editing.role);
        } else {
            setRole('volunteer');
            setFirstname('');
            setLastname('');
            setEmail('');
        }
    }, [editing]);

    const handleSubmit = () => {
        if ([firstName, lastName, email].includes('')) {
            setError('All fields are required');
            return;
        } else if (!email.match(EMAIL_REGEX)) {
            setError('Please enter a valid email');
            return;
        }

        const body = { firstName, lastName, email, role };

        const id = editing?.id;

        fetch(`/volunteers${id ? `/${id}` : ''}`, {
            method: id ? 'put' : 'post',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({ ...body })
        })
            .then(response => response.json())
            .then(data => {
                addVolunteer(data, id);
                onClose();
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleDelete = () => {
        fetch(`/volunteers/${editing.id}`, {
            method: 'delete',
            headers: new Headers({'content-type': 'application/json'}),
        })
            .then(response => response.json())
            .then(data => {
                addVolunteer(data, editing.id, true);
                onClose();
            })
            .catch(error => {
                setShowConfirm(false);
                setError(error.message);
            });
    };

    return(
        <Modal className="volunteer-add-form" show={isOpen} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>{editing ? 'Edit Volunteer' : 'Add Volunteer'}r</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label htmlFor="firstName">First Name</Form.Label>
                <Form.Control
                    name="firstName"
                    onChange={(e) => setFirstname(e.target.value)}
                    value={firstName}
                    placeholder="First Name"
                    type="text"
                />
                <Form.Label htmlFor="lastName">Last Name</Form.Label>
                <Form.Control
                    name="lastName"
                    onChange={(e) => setLastname(e.target.value)}
                    value={lastName}
                    placeholder="Last Name"
                    type="text"
                />
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Email"
                    type="text"
                />
                <div className="checkbox-label" onClick={() => setRole(role === 'admin' ? 'volunteer' : 'admin')}>
                    <Form.Check
                        label="Admin Access?"
                        checked={role === 'admin'}
                        onChange={() => null}
                    />
                    <OverlayTrigger
                        placement="bottom"
                        overlay={
                            <Tooltip>
                                {'Check this box to give this volunteer full administrator access of sites and other ' +
                                'volunteers.'}
                            </Tooltip>
                        }
                    >
                        <FontAwesomeIcon className="info-icon" icon={faInfoCircle}/>
                    </OverlayTrigger>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {error && <p className="error">{error}</p>}
                {editing && <Button className="delete-danger" onClick={() => setShowConfirm(true)}>Delete</Button>}
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>{editing ? 'Edit' : 'Add'}</Button>
            </Modal.Footer>
            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                action={handleDelete}
                type="volunteer"
            />
        </Modal>
    );
};

export default VolunteerAddForm;

VolunteerAddForm.propTypes = {
    isOpen: PropType.bool,
    onClose: PropType.func,
    addVolunteer: PropType.func,
    editing: PropType.object,
};