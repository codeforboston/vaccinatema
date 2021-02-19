import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

export default function SEO({ pageTitle }) {
  return (
    <Head>
      <title>{`${pageTitle} | Vaccinate MA`}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="A site to help Massachusetts residents find a vaccine" />
      <meta name="author" content="MA Volunteers" />
      <link rel="shortcut icon" type="image/x-icon" href="ma_logo.png" />
      <meta property="og:title" content="Helping Massachusetts residents get vaccinated" />
      <meta property="og:image" content="ma_logo.png"/>
    </Head>
  );
}

SEO.propTypes = {
  pageTitle: PropTypes.string,
};
