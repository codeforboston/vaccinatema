import React, { useState, useEffect } from 'react';
import Select from 'react-select';

import YesNoRadio from './subcomponents/YesNoRadio';
import DateTile from './subcomponents/DateTile';
import DatePicker from 'react-datepicker';
import { addSelectFields, alphabetize } from './utilities/utils';

const YES = 'yes', NO = 'no';

const UpdaterForm = () => {
    const [sites, setSites] = useState([]);
    const [dates, setDates] = useState([]);
    const [site, setSite] = useState(null);
    const [contact, setContact] = useState('');
    const [website, setWebsite] = useState('');
    const [datesKnown, setDatesKnown] = useState(null);
    const [isAvailable, setIsAvailable] = useState(null);
    const [nextAvailDate, setNextAvailDate] = useState(null);
    const [nextAvailKnown, setNextAvailKnown] = useState(null);

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
                const newOptions = alphabetize(addSelectFields(body), 'name');
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

    useEffect(() => {
        if (site) {
            // TODO: set website and contact if present?
        }
    }, [site]);

    const config = {
        instanceId: 'site-updater-select',
        menuPlacement: 'auto',
        isSearchable: true,
        placeholder: 'Select a site or start typing to search',
        onChange: (obj) => setSite(obj),
        options: sites,
        value: sites.find(op => op.value === site?.id),
    };

    const handleSubmit = () => {
        // TODO: package input and post to API
    };

    const addToDates = (date, slots) => {
        const newDates = [...dates];
        const idx = newDates.findIndex(entry => entry.date === date);
        if (idx === -1) {
            newDates.push({date, slots});
        } else {
            newDates.splice(idx, 1, {date, slots});
        }
        setDates(newDates);
    };

    const removeFromDates = (date) => {
        const newDates = [...dates];
        const idx = newDates.findIndex(entry => entry.date === date);
        newDates.splice(idx, 1);
        setDates(newDates);
    };

    const renderSubmitButton = () => {
        if (datesKnown !== null || nextAvailKnown !== null) {
            return (
                <span className="submit-container">
                    <p>Everything look good?</p>
                    <button className="submit-button" onClick={handleSubmit}>Submit Update</button>
                </span>
            );
        }
    };

    const renderAvailFields = () => {
        if (datesKnown === YES) {
            const dateTiles = dates.map(entry => {
                return (
                    <DateTile key={entry.date}
                        date={entry.date}
                        slots={entry.slots}
                        action={addToDates}
                        remove={removeFromDates}
                        dates={dates}
                    />
                );
            });
            dateTiles.push(
                <DateTile key={1}
                    date={null}
                    slots={''}
                    action={addToDates}
                    remove={removeFromDates}
                    dates={dates}
                />
            );

            return (
                <div>
                    {dateTiles}
                </div>
            );
        } else if (datesKnown === NO) {
            return (
                <div className="updater-form-fields">
                    <label htmlFor="contact">Contact email</label>
                    <input
                        type="text"
                        name="contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Email address to contact for dates and availability"
                    />
                </div>
            );
        }
    };

    const renderNoAvailFields = () => {
        const websiteInput = (
            <div>
                <label htmlFor="website">Website</label>
                <input type="text" name="website" id="website" value={website}
                    placeholder="Website to check availability, if known"
                    onChange={(e) => setWebsite(e.target.value)} />
            </div>
        );
        
        if (nextAvailKnown === YES) {
            return (
                <div className="updater-form-fields date-input">
                    <DatePicker
                        name="date"
                        selected={nextAvailDate}
                        onChange={(e) => setNextAvailDate(e)}
                        placeholderText="Choose date and time"
                        minDate={Date.now()}
                        showTimeSelect={true}
                        dateFormat='MMM. d h:mm a'
                    />
                    {websiteInput}
                </div>
            );
        } else if (nextAvailKnown === NO) {
            return (
                <div className="updater-form-fields">
                    {websiteInput}
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
    
    const renderQuestionOne = () => {
        if (site) {
            return (
                <div>
                    <YesNoRadio name="is-available" title="Do they have available appointments?"
                        action={setIsAvailable} value={isAvailable}/>
                    {renderAvailAnswered()}
                </div>
            );
        }
    };

    return (
        <div className="updater-form">
            <h2>Which site are you updating?</h2>
            <Select {...config} />
            {renderQuestionOne()}
            {renderSubmitButton()}
        </div>
    );
};

export default UpdaterForm;
