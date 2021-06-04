import React from 'react';
import App from 'next/app';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.scss';

class VaccinateMAApp extends App {
    render() {
        const {Component, pageProps} = this.props;

        return <Component {...pageProps} />;
    }
}

export default VaccinateMAApp;
