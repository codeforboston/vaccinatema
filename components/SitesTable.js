import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import SiteAddForm from './subcomponents/SiteAddForm';
const { SearchBar, ClearSearchButton } = Search;

const COLUMNS = [
    {
        dataField: 'name',
        text: 'Name',
        sort: true,
    }, {
        dataField: 'bookinglink',
        text: 'Booking Link',
        sort: true,
    }, {
        dataField: 'address',
        text: 'Address',
        sort: true,
    }, {
        dataField: 'serves',
        text: 'Serves',
        sort: true,
    }, {
        dataField: 'county',
        text: 'County',
        sort: true,
    }, {
        dataField: 'vaccinesoffered',
        text: 'Vaccines Offered',
        sort: true,
        hidden: true,
    }, {
        dataField: 'lastupdated',
        text: 'Last Updated',
        sort: true,
    }
];

const SitesTable = () => {
    const [sites, setSites] = useState([]);
    const [editing, setEditing] = useState(null);
    const [showSites, setShowSites] = useState(false);
    const [showSiteForm, setShowSiteForm] = useState(false);


    useEffect(() => {
        fetch('/locations', {
            method: 'get',
            headers: new Headers({'content-type': 'application/json'}),
        })
            .then(response => response.json())
            .then(data => setSites(data))
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleSiteAdd = (data, id, deleted) => {
        const newSites = _.cloneDeep(sites);
        if (id) {
            const idx = newSites.findIndex(vol => vol.id === id);
            if (deleted) {
                newSites.splice(idx, 1);
            } else {
                newSites.splice(idx, 1, data);
            }
        } else {
            newSites.push(data);
        }
        setSites(newSites);
    };

    const openEditor = (event, row) => {
        setEditing(row);
        setShowSiteForm(true);
    };

    const closeForm = () => {
        setShowSiteForm(false);
        setEditing(null);
    };

    const gridConfig = {
        defaultSorted: [
            { dataField: 'name', order: 'asc' },
        ],
        keyField: 'id',
        data: sites,
        columns: COLUMNS,
        rowEvents: {
            onClick: openEditor
        }
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
                        <Button className="table-add-button" onClick={() => setShowSiteForm(true)}>
                        Add a new site
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
        <div id="site-table">
            <h3 onClick={() => setShowSites(!showSites)}>
                Sites
                <FontAwesomeIcon icon={showSites ? faChevronUp : faChevronDown} />
            </h3>
            {showSites && renderTable()}
            <SiteAddForm
                isOpen={showSiteForm}
                onClose={closeForm}
                addSite={handleSiteAdd}
                editing={editing}
            />
        </div>
    );
};

export default SitesTable;