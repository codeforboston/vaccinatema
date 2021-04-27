import React from 'react';
import PropTypes from 'prop-types';

const Link = ({href, children}) => (
    <a href={href} target="_blank" rel="noreferrer">
        {children}
    </a>
);

export default Link;

Link.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
