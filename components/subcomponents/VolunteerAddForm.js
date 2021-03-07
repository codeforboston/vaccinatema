import React, { useState } from 'react';
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import PropType from 'prop-types';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const VolunteerAddForm = ({ isOpen, onClose, addVolunteer }) => {
    const [role, setRole] = useState('volunteer');
    const [firstName, setFirstname] = useState('');
    const [lastName, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = () => {
        if ([firstName, lastName, email].includes('')) {
            setError('All fields are required');
            return;
        } else if (!email.match(EMAIL_REGEX)) {
            setError('Please enter a valid email');
            return;
        }

        const body = { firstName, lastName, email, role };

        fetch('/volunteers', {
            method: 'post',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({ ...body })
        })
            .then(response => response.json())
            .then(data => {
                addVolunteer(data);
                onClose();
            })
            .catch(error => {
                console.log(error);
            });
    };

    return(
        <Modal className="volunteer-add-form" show={isOpen} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>Add Volunteer</Modal.Title>
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
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Add</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VolunteerAddForm;

VolunteerAddForm.propTypes = {
    isOpen: PropType.bool,
    onClose: PropType.func,
    addVolunteer: PropType.func,
};