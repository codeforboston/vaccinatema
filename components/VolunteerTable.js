import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import VolunteerAddForm from './subcomponents/VolunteerAddForm';

const VolunteerTable = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [showVolAdd, setShowVolAdd] = useState(false);
    const [showVolunteers, setShowVolunteers] = useState(false);


    useEffect(() => {
        fetch('/volunteers', {
            method: 'get',
            headers: new Headers({'content-type': 'application/json'}),
        })
            .then(response => response.json())
            .then(data => setVolunteers(data))
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleVolunteerAdd = (data) => {
        const newVols = _.cloneDeep(volunteers);
        newVols.push(data);
        setVolunteers(newVols);
    };

    const gridConfig = {
        keyField: 'id',
        data: volunteers,
        columns: [
            {
                dataField: 'firstname',
                text: 'First Name',
                sort: true,
            }, {
                dataField: 'lastname',
                text: 'Last Name',
                sort: true,
            }, {
                dataField: 'email',
                text: 'Email',
                sort: true,
            }, {
                dataField: 'role',
                text: 'Role',
                sort: true,
            }
        ]
    };
  
    return (
        <div id="volunteer-table">
            <h3 onClick={() => setShowVolunteers(!showVolunteers)}>
                Volunteers
                <FontAwesomeIcon icon={showVolunteers ? faChevronUp : faChevronDown} />
            </h3>
            {showVolunteers && <Button onClick={() => setShowVolAdd(true)}>Add a new volunteer</Button>}
            {showVolunteers && <BootstrapTable {...gridConfig}/>}
            <VolunteerAddForm
                isOpen={showVolAdd}
                onClose={() => setShowVolAdd(false)}
                addVolunteer={handleVolunteerAdd}
            />
        </div>
    );
};

export default VolunteerTable;