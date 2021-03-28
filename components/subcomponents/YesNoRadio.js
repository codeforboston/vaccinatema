
import React from 'react';
import PropType from 'prop-types';

const YesNoRadio = ({ name, title, action, value }) => {

    return(
        <div>
            <h2>{title}</h2>
            <div className="radio-button">
                <input type="radio" id={`${name}-yes`} name={`${name}-yes`} checked={value === 'yes'} value="yes"
                    onChange={() => action('yes')}/>
                <label htmlFor={`${name}-yes`}>Yes</label>
                <input type="radio" id={`${name}-no`} name={`${name}-no`} checked={value === 'no'} value="no"
                    onChange={() => action('no')}/>
                <label htmlFor={`${name}-no`}>No</label>
            </div>
        </div>
    );
};

export default YesNoRadio;

YesNoRadio.propTypes = {
    name: PropType.string,
    title: PropType.string,
    action: PropType.func,
    value: PropType.string,
};
