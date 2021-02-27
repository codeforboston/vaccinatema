import React from 'react';
import App from 'next/app';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.scss';

class VaccinateMAApp extends App {
    render() {
        const {Component, pageProps} = this.props;

        return (
            <Component {...pageProps} />
        );
    }
}

// TODO(hannah): Restore appWithTranslation once we actually have translations.
// export default appWithTranslation(VaccinateMAApp);
export default VaccinateMAApp;