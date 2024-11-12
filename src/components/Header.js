// src/components/Header.js
import React from 'react';
import logo from '../pages/images/logo.jpeg'; // Adjusted to go up one level to `src`


function Header() {
    return (
        <header className="header">
            <img src={logo} alt="UnfortunateCV Logo" className="logo" />
            <h1 className="site-title">UnfortunateCV</h1>
        </header>
    );
}

export default Header;
