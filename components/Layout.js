import React from 'react';
import PropTypes from 'prop-types';

import PageHead from './PageHead';
import NavHeader from './NavHeader';
import Footer from './Footer';

export default function Layout({
    children,
    pageTitle = '',
}) {
    return (
        <div className="container">
            <PageHead pageTitle={pageTitle} />
            <NavHeader />
            <div className="main-content">
                {children}
            </div>
            <Footer />
        </div>
    );
}

Layout.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    pageTitle: PropTypes.string,
};
