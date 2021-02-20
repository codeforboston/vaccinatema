import React from 'react';

// TODO: remove "../" after promoting to root

const Logo = () => (
    <div className="logo-container" onClick={() => window.location.href = '/' }>
        <img src={'../../ma_logo.png'} alt=""/>
        <h1>VaccinateMA</h1>
    </div>
);

export default Logo;