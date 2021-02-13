import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.scss';
// import '../styles/index.css'
import React from 'react';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}