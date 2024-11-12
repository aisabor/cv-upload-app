import React from 'react';
import './CVCard.css'; // Import styles specific to CVCard

function CVCard({ cv, onOpen }) {
    return (
        <div className="cv-card" onClick={() => onOpen(cv)}>
            <h4>{cv.name}</h4>
            <div className="cv-preview">
                <iframe
                    src={cv.url}
                    title={cv.name}
                    width="100%"
                    height="150px"
                    style={{ border: 'none' }}
                />
            </div>
            <button className="download-btn" onClick={() => window.open(cv.url)}>Download CV</button>
        </div>
    );
}

export default CVCard;
