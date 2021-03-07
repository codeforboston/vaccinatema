import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import PropType from 'prop-types';

const VolunteerAddForm = ({ isOpen, onClose, addSite, editing }) => {
    const [siteinstructions, setSiteinstructions] = useState(editing?.siteinstructions || '');
    const [vaccinesOffered, serVaccinesOffered] = useState(editing?.vaccinesoffered || '');
    const [accessibility, setAccessibility] = useState(editing?.accessibility || '');
    const [bookinglink, setBookinglink] = useState(editing?.bookinglink || '');
    const [address, setAddress] = useState(editing?.address || '');
    const [serves, setServes] = useState(editing?.serves || '');
    const [county, setCounty] = useState(editing?.county || '');
    const [phone, setPhone] = useState(editing?.phone || '');
    const [email, setEmail] = useState(editing?.email || '');
    const [name, setName] = useState(editing?.name || '');
    const [error, setError] = useState(null);
    
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
            field: 'siteinstructions',
            value: siteinstructions,
            action: setSiteinstructions,
            label: 'Site Instructions',
            required: true
        }, {
            field: 'county',
            value: county,
            action: setCounty,
            label: 'County',
            required: true
        }, {
            field: 'vaccinesOffered',
            value: vaccinesOffered,
            action: serVaccinesOffered,
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
            vaccinesOffered,
            accessibility,
            bookinglink,
            address,
            serves,
            county,
            phone,
            email, 
            name
        };

        fetch('/locations', {
            method: editing ? 'put' : 'post',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({ ...body })
        })
            .then(response => response.json())
            .then(data => {
                addSite(data);
                onClose();
            })
            .catch(error => {
                setError(error.message);
            });
    };
    
    const formFields = fieldConfig.map(field => {
        return (
            <div key={field.field}>
                <Form.Label htmlFor={field.field}>{field.label + (field.required && ' (required)') }</Form.Label>
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
    addSite: PropType.func,
    editing: PropType.object,
};