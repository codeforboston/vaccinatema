import React from 'react';

// TODO: remove "../" after promoting to root

const Logo = () => (
    <div className="logo-container" onClick={() => window.location.href = '/' }>
        <img src={'../../ma_logo.png'} alt=""/>
        <span className="logo-text">VaccinateMA</span>
    </div>
);

export default Logo;
