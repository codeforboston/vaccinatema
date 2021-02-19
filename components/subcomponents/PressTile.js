import React from 'react';
import PropTypes from 'prop-types';

const PressTile = ({ name, title, link }) => {
  return (
    <div>
      <h2>{name}</h2>
      <a
        href={link}
        target="_blank" rel="noreferrer">
        {title}
      </a>
    </div>
  );
};

export default PressTile;

PressTile.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  link: PropTypes.string,
};
