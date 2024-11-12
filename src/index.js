// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Corrected import from "react-dom/client"
import App from './App';
import './styles/styles.css'; // Import global styles

// Create the root using createRoot from "react-dom/client"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
