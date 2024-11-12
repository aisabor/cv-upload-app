// src/components/UploadCV.js
import React, { useState } from 'react';

function UploadCV({ onAddCV, userId }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Debugging logs to check if values are being set correctly
        console.log('File:', file);
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('User ID:', userId);

        // Ensure all required fields are provided
        if (!file || !title || !userId) {
            alert('Please provide a title, description, and file.');
            return;
        }

        // Create FormData object
        const formData = new FormData();
        formData.append('cv', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('userId', userId);

        try {
            const response = await fetch('http://localhost:5001/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const newCV = await response.json();
                onAddCV(newCV); // Call the onAddCV function passed as a prop
                alert('CV uploaded successfully');
                // Reset the form fields
                setFile(null);
                setTitle('');
                setDescription('');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed'); // Handle server error responses
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Upload error: ' + error.message);
        }
    };

    return (
        <div className="upload-form">
            <h3>Upload Your CV</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required // Title is required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf, .doc, .docx" // Accept specific file types
                    required // File upload is required
                />
                <button type="submit">Upload CV</button>
            </form>
        </div>
    );
}

export default UploadCV;
