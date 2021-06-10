import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faLocationArrow, faMap, faList} from '@fortawesome/free-solid-svg-icons';

const getIcon = (icon) => {
    if (!icon) {
        return null;
    }
    switch (icon) {
        case 'search':
            return <FontAwesomeIcon icon={faSearch} />;
        case 'location':
            return <FontAwesomeIcon icon={faLocationArrow} />;
        case 'map':
            return <FontAwesomeIcon icon={faMap} />;
        case 'list':
            return <FontAwesomeIcon icon={faList} />;
    }
    return null;
};

const Button = (props) => (
    <button
        className={`button-custom button-custom-${props.color}`}
        onClick={props.onClick}
        style={{borderRadius: props.borderRadius || '4px'}}
    >
        {getIcon(props.icon)}
        {props.title}
    </button>
);

export default Button;

Button.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.oneOf(['search', 'location', 'map', 'list']),
    color: PropTypes.oneOf(['gray', 'blue', 'green', 'lightGray']).isRequired,
    onClick: PropTypes.func.isRequired,
    borderRadius: PropTypes.string,
};
