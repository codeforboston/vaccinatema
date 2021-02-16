import React from 'react';

// TODO: remove "../" after promoting to root

const Logo = () => (
    <div className="logo-container" onClick={() => window.location.href = '/' }>
        <h3><img src={'../../ma_logo.png'} alt="MA logo"/>VaccinateMA</h3>
    </div>
);

export default Logo;