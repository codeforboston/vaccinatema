import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faLocationArrow} from '@fortawesome/free-solid-svg-icons';

/**
 * A button that triggers some action on click.
 */
export const ActionButton = (props) => (
    <Button {...props} />
);

/**
 * A button that redirects to another page or website.
 */
export const LinkButton = (props) => (
    <Link href={props.href} passHref>
        <Button {...props} />
    </Link>
);

const Button = React.forwardRef((props, ref) => (
    <div className={`button-custom button-custom-${props.color}`}>
        <a
            href={props.href}
            onClick={props.onClick}
            ref={ref}
        >
            {props.icon && props.icon == 'search' && (
                <FontAwesomeIcon icon={faSearch} />
            )}
            {props.icon && props.icon == 'location' && (
                <FontAwesomeIcon icon={faLocationArrow} />
            )}
            {props.title}
        </a>
    </div>
));

const sharedProps = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.oneOf(['search', 'location']),
    color: PropTypes.oneOf(['gray', 'blue', 'green']).isRequired,
};

ActionButton.propTypes = {
    ...sharedProps,
    onClick: PropTypes.func,
};

LinkButton.propTypes = {
    ...sharedProps,
    href: PropTypes.string,
};

Button.displayName = 'Button';
Button.propTypes = {
    ...sharedProps,
    onClick: PropTypes.func,
    href: PropTypes.string,
};
