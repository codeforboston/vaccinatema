import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import SiteAddForm from './subcomponents/SiteAddForm';

const COLUMNS = [
    {
        dataField: 'name',
        text: 'name',
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
    const [showSites, setShowSites] = useState(false);
    const [showSiteAdd, setShowSiteAdd] = useState(false);


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

    const handleSiteAdd = (data) => {
        const newVols = _.cloneDeep(sites);
        newVols.push(data);
        setSites(newVols);
    };

    const gridConfig = {
        keyField: 'id',
        data: sites,
        columns: COLUMNS,
    };

    return (
        <div id="site-table">
            <h3 onClick={() => setShowSites(!showSites)}>
                Sites
                <FontAwesomeIcon icon={showSites ? faChevronUp : faChevronDown} />
            </h3>
            {showSites && <Button onClick={() => setShowSiteAdd(true)}>Add a new site</Button>}
            {showSites && <BootstrapTable {...gridConfig}/>}
            <SiteAddForm
                isOpen={showSiteAdd}
                onClose={() => setShowSiteAdd(false)}
                addSite={handleSiteAdd}
            />
        </div>
    );
};

export default SitesTable;