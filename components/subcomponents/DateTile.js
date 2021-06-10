import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace } from '@fortawesome/free-solid-svg-icons';

import PropTypes from 'prop-types';

const DateTile = ({ date, slots, action, remove, dates }) => {
    const [slotCount, setSlotCount] = useState(null);

    useEffect(() => {
        setSlotCount(slots);
    }, []);

    let excludeDates = [];
    dates.forEach(entry => {
        if (entry.date !== date) {
            excludeDates.push(entry.date);
        }
    });

    const renderOptions = () => {
        if (date) {
            return (
                <div>
                    <label htmlFor="slots">Slots:</label>
                    <input
                        type="text"
                        name="slots"
                        onChange={(e) => setSlotCount(e.target.value)}
                        onBlur={() => action(date, slotCount)}
                        value={slotCount}
                        placeholder="Number, if known"
                    />
                    <FontAwesomeIcon icon={faBackspace} onClick={() => remove(date)} />
                </div>
            );
        }
    };

    return (
        <div className="date-tile">
            <label htmlFor="date">Date:</label>
            <DatePicker
                name="date"
                selected={date}
                onChange={(e) => action(e, slotCount)}
                placeholderText="Choose date"
                minDate={Date.now()}
                excludeDates={excludeDates}
            />
            {renderOptions()}
        </div>
    );
  
};

export default DateTile;

DateTile.propTypes = {
    date: PropTypes.instanceOf(Date),
    remove: PropTypes.func,
    slots: PropTypes.string,
    action: PropTypes.func,
    dates: PropTypes.array,
};
