import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import PropType from 'prop-types';
import _ from 'lodash';

import ConfirmModal from './ConfirmModal';
import { addSelectFields, alphabetize } from '../utilities/utils';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const VolunteerAddForm = ({ isOpen, onClose, addVolunteer, editing, sites }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [volLocations, setVolLocations] = useState([]);
    const [locations, setLocations] = useState(null);
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
            // get volunteer locations and remove them from the list of locations to display
            fetch(`/volunteers-locations?volunteerId=${editing.id}`, {
                method: 'get',
                headers: new Headers({'content-type': 'application/json'}),
            })
                .then(response => response.json())
                .then(data => {
                    const newVolLocations = addSelectFields(data);
                    setVolLocations(alphabetize(newVolLocations, 'name'));
                    const newSites = [];
                    sites.forEach(obj => {
                        if (data.findIndex(x => x.id === obj.id) === -1) {
                            const newSite = addSelectFields(obj);
                            newSites.push(newSite);
                        }
                    });
                    setLocations(alphabetize(newSites, 'label'));
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            setRole('volunteer');
            setVolLocations([]);
            setLocations([]);
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

    const VolunteerLocations = () => {
        const addSite = (obj) => {
            const body = {
                volunteerId: editing.id,
                locationId: obj.id,
            };
            fetch('/volunteers-locations', {
                method: 'post',
                headers: new Headers({'content-type': 'application/json'}),
                body: JSON.stringify({ ...body })
            })
                .then(response => response.json())
                .then(data => {
                    const newVolLocations = _.clone(volLocations);
                    newVolLocations.push(obj);
                    const newLocations = _.clone(locations);
                    const idx = newLocations.findIndex(loc => loc.id === data.location_id);
                    newLocations.splice(idx, 1);
                    setVolLocations(alphabetize(newVolLocations, 'name'));
                    setLocations(newLocations);
                })
                .catch(error => {
                    console.log(error);
                });
        };

        const removeSite = (obj) => {
            fetch(`/volunteers-locations?volunteerId=${editing.id}&locationId=${obj.id}`, {
                method: 'delete',
                headers: new Headers({'content-type': 'application/json'}),
            })
                .then(response => response.json())
                .then(data => {
                    const newLocations = _.clone(locations);
                    newLocations.push(obj);
                    const newVolLocations = _.clone(volLocations);
                    const idx = newVolLocations.findIndex(loc => loc.id === data.location_id);
                    newVolLocations.splice(idx, 1);
                    setLocations(alphabetize(newLocations, 'name'));
                    setVolLocations(newVolLocations);
                })
                .catch(error => {
                    console.log(error);
                });
        };

        const otherSitesConfig = {
            instanceId: 'other-site-select',
            menuPlacement: 'auto',
            isSearchable: true,
            placeholder: 'Other sites: select to assign',
            onChange: addSite,
            options: locations,
            value: null,
        };

        const assignedSitesConfig = {
            instanceId: 'assigned-site-select',
            menuPlacement: 'auto',
            isSearchable: true,
            placeholder: 'Assigned sites: select to remove',
            onChange: removeSite,
            options: volLocations,
            value: null,
        };

        return (
            <div>
                <p>Assign sites to this volunteer</p>
                <Select {...otherSitesConfig} />
                <Select {...assignedSitesConfig} />
            </div>
        );
    };

    return(
        <Modal className="volunteer-add-form" show={isOpen} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>{editing ? 'Edit Volunteer' : 'Add Volunteer'}</Modal.Title>
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
                {editing && <VolunteerLocations/>}
            </Modal.Body>
            <Modal.Footer>
                {error && <p className="error">{error}</p>}
                {editing && <Button className="delete-danger" onClick={() => setShowConfirm(true)}>Delete</Button>}
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>{editing ? 'Save' : 'Add'}</Button>
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
    sites: PropType.array,
};