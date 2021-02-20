import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import YesNoRadio from './subcomponents/YesNoRadio';

const YES = 'yes', NO = 'no';

const UpdaterForm = () => {
    const [sites, setSites] = useState([]);
    const [site, setSite] = useState(null);
    const [website, setWebsite] = useState('');
    const [datesKnown, setDatesKnown] = useState(null);
    const [isAvailable, setIsAvailable] = useState(null);
    const [nextAvailKnown, setNextAvailKnown] = useState(null);
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);


    useEffect(() => {
        fetch('/locations', { credentials: 'same-origin' })
            .then(response => {
                if (response.ok) {
                    return response;
                } else {
                    let errorMessage = `${response.status} (${response.statusText})`,
                        error = new Error(errorMessage);
                    throw(error);
                }
            })
            .then(response => {
                return response.json();
            })
            .then(body => {
                const newOptions = body.map(obj => {
                    return {
                        value: obj.name,
                        label: obj.name,
                    };
                }).sort((a, b) => {
                    if (a.value < b.value) { return -1; }
                    if (a.value > b.value) { return 1; }
                    return 0;
                });
                setSites(newOptions);
            })
            .catch(error => console.error(`Error in fetch: ${error.message}`));
    }, []);

    useEffect(() => {
        // Clear state if answer to question 1 changes
        if (isAvailable === YES) {
            setNextAvailKnown(null);
        } else if (isAvailable === NO) {
            setDatesKnown(null);
        }
    }, [isAvailable]);

    const config = {
        instanceId: 'site-updater-select',
        menuPlacement: 'auto',
        isSearchable: true,
        placeholder: 'Select a site',
        onChange: (obj) => setSite(obj.value),
        options: sites,
        value: sites.find(op => op.value === site?.['name']),
    };

    const handleSubmit = () => {

    };

    const renderSubmitButton = () => (
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
    );

    const renderAvailFields = () => {
        if (datesKnown === YES) {
            return (
                <div>
                    <DatePicker
                        selected={selectedDate}
                        onSelect={(e) => setSelectedDate(e)}
                        placeholderText="Choose Date"
                        minDate={Date.now()}
                    />
                    {renderSubmitButton()}
                </div>
            );
        } else if (datesKnown === NO) {
            return (
                <div>
                    {renderSubmitButton()}
                </div>
            );
        }
    };

    const renderNoAvailFields = () => {
        if (nextAvailKnown === YES) {
            return (
                <div>
                    <h6>Enter the website where availability will be announced, if known, then hit submit.</h6>
                    <input type="text" name="website" id="website" value={website}
                        onChange={(e) => setWebsite(e.target.value)} />
                    {renderSubmitButton()}
                </div>
            );
        } else if (nextAvailKnown === NO) {
            return (
                <div>
                    <h2>Enter date, time, and website if applicable</h2>
                    <input type="text" name="website" id="website" value={website}
                        onChange={(e) => setWebsite(e.target.value)} />
                    {renderSubmitButton()}
                </div>
            );
        }
    };

    const renderAvailAnswered = () => {
        if (isAvailable === YES) {
            return (
                <div>
                    <YesNoRadio name="dates-known" title="Do you know the date(s) of the clinic?"
                        action={setDatesKnown} value={datesKnown}/>
                    {renderAvailFields()}
                </div>
            );
        } else if (isAvailable === NO) {
            return (
                <div>
                    <YesNoRadio name="next-avail-known" title="Do you know when there will next be availability?"
                        action={setNextAvailKnown} value={nextAvailKnown}/>
                    {renderNoAvailFields()}
                </div>
            );
        }
    };

    return (
        <div className="updater-form">
            <h2>Which site are you updating?</h2>
            <Select {...config} />
            <YesNoRadio name="is-available" title="Do they have available appointments?"
                action={setIsAvailable} value={isAvailable}/>
            {renderAvailAnswered()}
        </div>
    );
};

export default UpdaterForm;