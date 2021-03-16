import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import PropType from 'prop-types';

import ConfirmModal from './ConfirmModal';

const VolunteerAddForm = ({ isOpen, onClose, addSite, editing }) => {
    const [siteinstructions, setSiteinstructions] = useState('');
    const [vaccinesoffered, setVaccinesoffered] = useState('');
    const [accessibility, setAccessibility] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [bookinglink, setBookinglink] = useState('');
    const [methodology, setMethodology] = useState('');
    const [independent, setIndependent] = useState('');
    const [hiatus, setHiatus] = useState(null);
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    const [serves, setServes] = useState('');
    const [county, setCounty] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        setError(null);
        if (editing) {
            setSiteinstructions(editing.siteinstructions);
            setVaccinesoffered(editing.vaccinesoffered);
            setAccessibility(editing.accessibility);
            setBookinglink(editing.bookinglink);
            setAddress(editing.address);
            setServes(editing.serves);
            setCounty(editing.county);
            setPhone(editing.phone);
            setEmail(editing.email);
            setName(editing.name);
        } else {
            setSiteinstructions('');
            setVaccinesoffered('');
            setAccessibility('');
            setBookinglink('');
            setAddress('');
            setServes('');
            setCounty('');
            setPhone('');
            setEmail('');
            setName('');
        }
    }, [editing]);

    const fieldConfig = [
        {
            field: 'name',
            value: name,
            action: setName,
            label: 'name',
            required: true
        }, {
            field: 'bookinglink',
            value: bookinglink,
            action: setBookinglink,
            label: 'Booking Link',
            required: true
        }, {
            field: 'address',
            value: address,
            action: setAddress,
            label: 'Address',
            required: true
        }, {
            field: 'serves',
            value: serves,
            action: setServes,
            label: 'Serves',
            required: true
        }, {
            field: 'county',
            value: county,
            action: setCounty,
            label: 'County',
            required: true
        }, {
            field: 'siteinstructions',
            value: siteinstructions,
            action: setSiteinstructions,
            label: 'Site Instructions',
        }, {
            field: 'vaccinesoffered',
            value: vaccinesoffered,
            action: setVaccinesoffered,
            label: 'Vaccines Offered',
        }, {
            field: 'phone',
            value: phone,
            action: setPhone,
            label: 'Phone',
        }, {
            field: 'email',
            value: email,
            action: setEmail,
            label: 'Email',
        }, {
            field: 'accessibility',
            value: accessibility,
            action: setAccessibility,
            label: 'Accessibility',
        }, {
            field: 'methodology',
            value: methodology,
            action: setMethodology,
            label: 'Methodology',
        }, {
            field: 'independent',
            value: independent,
            action: setIndependent,
            label: 'Independent?',
            radioOptions: [{ label: 'Independent', value: true }, { label: 'State', value: false } ]
        }, {
            field: 'hiatus',
            value: hiatus,
            action: setHiatus,
            label: 'Hiatus?',
            radioOptions: [{ label: 'Yes', value: true }, { label: 'No', value: false } ]
        }
    ];

    const handleSubmit = () => {
        if ([name, bookinglink, address, serves, siteinstructions].includes('')) {
            setError('Please complete the required fields');
            return;
        }

        const body = {
            daysopen: {},
            siteinstructions,
            vaccinesoffered,
            accessibility,
            bookinglink,
            address,
            serves,
            county,
            phone,
            email, 
            name
        };

        const id = editing?.id;

        fetch(`/locations${id ? `/${id}` : ''}`, {
            method: id ? 'put' : 'post',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({ ...body })
        })
            .then(response => response.json())
            .then(data => {
                addSite(data, id);
                onClose();
            })
            .catch(error => {
                setError(error.message);
            });
    };
    
    const handleDelete = () => {
        fetch(`/locations/${editing.id}`, {
            method: 'delete',
            headers: new Headers({'content-type': 'application/json'}),
        })
            .then(response => response.json())
            .then(data => {
                addSite(data, editing.id, true);
                onClose();
            })
            .catch(error => {
                setShowConfirm(false);
                setError(error.message);
            });
    };
    
    const formFields = fieldConfig.map(field => {
        // TODO: add radio buttons
        return (
            <div key={field.field}>
                <Form.Label htmlFor={field.field}>{field.label + (field.required ? ' (required)' : '') }</Form.Label>
                <Form.Control
                    name={field.field}
                    onChange={(e) => field.action(e.target.value)}
                    value={field.value}
                    placeholder={field.label}
                    type="text"
                />
            </div>
        );
    });

    return(
        <Modal className="site-add-form" show={isOpen} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>{editing ? 'Edit Site' : 'Add Site'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {formFields}
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
                type="site"
            />
        </Modal>
    );
};

export default VolunteerAddForm;

VolunteerAddForm.propTypes = {
    isOpen: PropType.bool,
    onClose: PropType.func,
    addSite: PropType.func,
    editing: PropType.object,
};