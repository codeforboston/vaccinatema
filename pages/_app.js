import React from 'react';
import App from 'next/app';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.scss';
import {appWithTranslation} from '../i18n';

class VaccinateMAApp extends App {
	render() {
		const {Component, pageProps} = this.props;

		return (
			<Component {...pageProps} />
		);
	}
}

export default appWithTranslation(VaccinateMAApp);