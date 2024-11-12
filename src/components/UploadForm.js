import React, { useState } from 'react';

function CVUpload({ onCVUpload }) {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file) {
            const cvData = {
                id: Date.now(),
                name: file.name,
                url: URL.createObjectURL(file),
                likes: 0,
                comments: [],
            };
            onCVUpload(cvData);
            setFile(null);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} required />
            <button type="submit">Upload CV</button>
        </form>
    );
}

export default CVUpload;
