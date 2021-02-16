import React from 'react';

const PressTile = ({ name, title, link }) => {
  return (
    <div>
      <h2>{name}</h2>
      <a
        href={link}
        target="_blank">
        {title}
      </a>
    </div>
  )
};

export default PressTile;