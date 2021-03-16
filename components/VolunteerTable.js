import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import PropType from 'prop-types';
import _ from 'lodash';

import VolunteerAddForm from './subcomponents/VolunteerAddForm';

const { SearchBar, ClearSearchButton } = Search;

const COLUMNS = [
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
];

const VolunteerTable = ({ volunteers, setVolunteers, sites }) => {
    const [editing, setEditing] = useState(null);
    const [showVolForm, setShowVolForm] = useState(false);
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

    const handleVolunteerAdd = (data, id, deleted) => {
        const newVols = _.cloneDeep(volunteers);
        if (id) {
            const idx = newVols.findIndex(vol => vol.id === id);
            if (deleted) {
                newVols.splice(idx, 1);
            } else {
                newVols.splice(idx, 1, data);
            }
        } else {
            newVols.push(data);
        }
        setVolunteers(newVols);
    };

    const openEditor = (event, row) => {
        setEditing(row);
        setShowVolForm(true);
    };

    const closeForm = () => {
        setShowVolForm(false);
        setEditing(null);
    };

    const gridConfig = {
        defaultSorted: [
            { dataField: 'lastname', order: 'asc' },
        ],
        keyField: 'id',
        data: volunteers,
        columns: COLUMNS,
        rowEvents: {
            onClick: openEditor
        },
        striped: true,
    };

    // ToolkitProvider allows the table to use search functionality
    // It sends the relevant data to the table in params.baseProps.
    // The original gridConfig is required in the table properties for sorting and row events.
    const renderTable = () => (
        <ToolkitProvider
            {...gridConfig}
            search
            bootstrap4
        >
            {
                params => (
                    <div>
                        <Button className="table-add-button" onClick={() => setShowVolForm(true)}>
                            Add a new volunteer
                        </Button>
                        <SearchBar { ...params.searchProps } />
                        <ClearSearchButton { ...params.searchProps } />
                        <hr />
                        <BootstrapTable
                            { ...Object.assign({}, gridConfig, params.baseProps) }
                        />
                    </div>
                )
            }
        </ToolkitProvider>
    );
  
    return (
        <div id="volunteer-table">
            <h3 onClick={() => setShowVolunteers(!showVolunteers)}>
                Volunteers
                <FontAwesomeIcon icon={showVolunteers ? faChevronUp : faChevronDown} />
            </h3>
            {showVolunteers && renderTable()}
            <VolunteerAddForm
                isOpen={showVolForm}
                onClose={closeForm}
                addVolunteer={handleVolunteerAdd}
                editing={editing}
                sites={sites}
            />
        </div>
    );
};

export default VolunteerTable;
VolunteerTable.propTypes = {
    sites: PropType.array,
    volunteers: PropType.array,
    setVolunteers: PropType.func,
};