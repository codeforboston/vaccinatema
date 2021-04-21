import React from 'react';
import PropTypes from 'prop-types';

import PageHead from './PageHead';
import NavHeader from './NavHeader';
import Footer from './Footer';

export default function Layout({
    children,
    pageTitle = '',
    // If set, applies an additional classname to the container.
    containerClassName = '',
}) {
    return (
        <div className={`container ${containerClassName}`}>
            <PageHead pageTitle={pageTitle} />
            <NavHeader />
            <div className="main-content">{children}</div>
            <Footer />
        </div>
    );
}

Layout.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    pageTitle: PropTypes.string,
    containerClassName: PropTypes.string,
};
