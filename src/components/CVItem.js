import React from 'react';
import './CVItem.css';

function CVItem({ cv, onClick }) {
    const renderFilePreview = () => {
        if (!cv.filePath) return <p>No file available for preview.</p>;

        // Construct the full URL for the file
        const fileURL = `http://localhost:5001/uploads/${cv.filePath}`; // Use the correct base URL for your server

        const fileExtension = cv.filePath.split('.').pop().toLowerCase();

        switch (fileExtension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <img src={fileURL} alt={cv.title} className="cv-thumbnail" />;
            case 'pdf':
                return (
                    <p>
                        PDF File: <a href={fileURL} target="_blank" rel="noopener noreferrer">View PDF</a>
                    </p>
                );
            default:
                return (
                    <p>
                        File format not supported for preview.{' '}
                        <a href={fileURL} target="_blank" rel="noopener noreferrer">
                            Download File
                        </a>
                    </p>
                );
        }
    };

    return (
        <div className="cv-item" onClick={onClick}>
            <h3>{cv.title}</h3>
            <p>{cv.description}</p>
            <p>Uploaded by: {cv.uploadedBy}</p>
            <p>Likes: {cv.likeCount}</p>

            <div className="file-preview">
                {renderFilePreview()} {/* Show the file preview */}
            </div>
        </div>
    );
}

export default CVItem;
