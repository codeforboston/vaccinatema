import React from 'react';
import PropTypes from 'prop-types';

import Seo from './Seo';
import NavHeader from './NavHeader';
import Footer from './Footer';

export default function Layout({
    children,
    pageTitle = '',
}) {
    return (
        <div className="container">
            <Seo pageTitle={pageTitle} />
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
