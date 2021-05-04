import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typeahead as BootstrapTypeahead } from 'react-bootstrap-typeahead';
import { readString } from 'react-papaparse';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const Typeahead = ({selectedZipCodeObj, onSelectZipCodeObj, onKeyDown}) => {

    const [zipCodeOptions, setZipCodeOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    // We track whether we think the user is searching for a zipcode (numeric) or
    // a city name, so we can render the autocomplete in the most user friendly way.
    const [usingNumericInput, setUsingNumericInput] = useState(true);

    useEffect(() => {
        fetch('ma-zip-code-data.csv', { 
            headers : { 
                'Content-Type': 'application/csv',
                'Accept': 'application/csv'
            }
        }).then(response => {
            return response.text();
        }).then(csvStr => {
            const parsedCSV = readString(csvStr, {header: true}).data;
            setCityOptions(getCityOptions(parsedCSV));
            setZipCodeOptions(getZipCodeOptions(parsedCSV));
        });
    }, []);

    const getCityOptions = (parsedCSV) => {
        const options = [];
        // The set of cities we have already added
        const cityNames = new Set();
        parsedCSV.forEach(location => {
            const city = location['City'].toString();
            // Only add a city if it is the first time we have seen it
            if (!cityNames.has(city)) {
                options.push({
                    'zipcode': location['Zip'],
                    'city': location['City'],
                    'latitude': parseFloat(location['Latitude']),
                    'longitude': parseFloat(location['Longitude']),
                    'label': city,
                });
                cityNames.add(city);
            }
        }); 
        return options;
    };


    const getZipCodeOptions = (parsedCsv) => {
        const options = [];
        parsedCsv.forEach(location => {
            options.push({
                'zipcode': location['Zip'],
                'city': location['City'],
                'latitude': parseFloat(location['Latitude']),
                'longitude': parseFloat(location['Longitude']),
                'label': `${location['City']} (${location['Zip']})`
            });
        });
        return options;
    };

    const updateUsingNumeric = (searchText) => {
        if (!isNaN(searchText)) {
            setUsingNumericInput(true);
        } else {
            setUsingNumericInput(false);
        }
    };


    return (
        <BootstrapTypeahead 
            id="typeahead"
            onInputChange={updateUsingNumeric}
            selected={selectedZipCodeObj}
            onChange={onSelectZipCodeObj}
            options={usingNumericInput ? zipCodeOptions :  cityOptions}
            onKeyDown={onKeyDown} >
        </BootstrapTypeahead>
    );
};

export default Typeahead;

Typeahead.propTypes = {
    selectedZipCodeObj: PropTypes.object,
    onSelectZipCodeObj: PropTypes.func,
    onKeyDown: PropTypes.func,
};
