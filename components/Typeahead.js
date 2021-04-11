import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typeahead as BootstrapTypeahead } from 'react-bootstrap-typeahead';
import { readString } from 'react-papaparse';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const Typeahead = ({onSelectZipCodeObj}) => {

    const [selectedZipCodeObj, setSelectedZipCodeObj] = useState();
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        fetch('ma-zip-code-data.csv', { 
            headers : { 
                'Content-Type': 'application/csv',
                'Accept': 'application/csv'
            }
        }).then(response => {
            return response.text().then(csvStr => {
                const results = readString(csvStr, {header: true});
                const parsedZipcodes = [];
                results.data.forEach(location => {
                    parsedZipcodes.push({
                        'zipcode': location['Zip'],
                        'city': location['City'],
                        'latitude': location['Latitude'],
                        'longitude': location['Longitude'],
                        'label': `${location['City']} (${location['Zip']})`
                    });
                });
                console.log(parsedZipcodes);
                setLocations(parsedZipcodes);
            });
        });
    }, []);

  

    return (
        <BootstrapTypeahead 
            id="typeahead"
            onChange={(selected) => {
                console.log(selected);
                if (selected.length > 0) {
                    setSelectedZipCodeObj(selected[0]);
                    onSelectZipCodeObj(selected[0]);
                }
            }}
            options={locations} >
        </BootstrapTypeahead>
    );
};

export default Typeahead;

Typeahead.propTypes = {
    onSelectZipCodeObj: PropTypes.func
};
