import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faLocationArrow} from '@fortawesome/free-solid-svg-icons';

const Button = (props) => (
    <button
        className={`button-custom button-custom-${props.color}`}
        onClick={props.onClick}
    >
        {props.icon && props.icon == 'search' && (
            <FontAwesomeIcon icon={faSearch} />
        )}
        {props.icon && props.icon == 'location' && (
            <FontAwesomeIcon icon={faLocationArrow} />
        )}
        {props.title}
    </button>
);

export default Button;

Button.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.oneOf(['search', 'location']),
    color: PropTypes.oneOf(['gray', 'blue', 'green']).isRequired,
    onClick: PropTypes.func.isRequired,
};
