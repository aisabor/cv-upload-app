import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CVItem from '../components/CVItem';
import CVDetail from '../components/CVDetail';
import './CVGallery.css';

function CVGallery({ currentUser }) {
    const [cvs, setCvs] = useState([]);
    const [selectedCV, setSelectedCV] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCVs = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/cvs');
                if (Array.isArray(response.data)) {
                    setCvs(response.data);
                } else {
                    throw new Error('Expected an array of CVs');
                }
            } catch (error) {
                setError('Failed to fetch CVs. Please try again later.');
                console.error('Error fetching CVs:', error);
            }
        };

        fetchCVs();
    }, []);

    const handleCardClick = (cv) => {
        setSelectedCV(cv);
    };

    const handleCloseDetail = () => {
        setSelectedCV(null);
    };
    const handleUpdateLikes = async (cvId, likeStatus, likeCount) => {
        try {
            const updatedLikes = likeStatus ? likeCount - 1 : likeCount + 1;
            const response = await axios.post('http://localhost:5001/api/like', { userId: currentUser.id, cvId });
    
            // Check the response status
            if (response.status === 201) {
                setCvs((prevCvs) =>
                    prevCvs.map((cv) =>
                        cv.id === cvId ? { ...cv, likeCount: updatedLikes } : cv
                    )
                );
            } else {
                setError(`Failed to update like status: ${response.data.error}`);
                console.error('Error updating like status:', response.data.error);
            }
        } catch (error) {
            setError(`Failed to update like status: ${error.message}`);
            console.error('Error updating like status:', error);
        }
    };

    const handleUpdateComments = async (cvId, comment) => {
        try {
            await axios.post('http://localhost:5001/api/comment', {
                userId: currentUser.id,
                cvId,
                content: comment,
            });

            setCvs((prevCvs) =>
                prevCvs.map((cv) =>
                    cv.id === cvId
                        ? { ...cv, comments: [...cv.comments, { content: comment }] }
                        : cv
                )
            );
        } catch (error) {
            setError('Failed to submit comment. Please try again.');
            console.error('Error submitting comment:', error);
        }
    };

    return (
        <div className="cv-gallery">
            <h2>CV Gallery</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {cvs.length > 0 ? (
                <div className="cv-gallery-grid">
                    {cvs.map((cv) => (
                        <CVItem
                            key={cv.id}
                            cv={cv}
                            onClick={() => handleCardClick(cv)}
                        />
                    ))}
                </div>
            ) : (
                <p>No CVs uploaded yet.</p>
            )}

            {selectedCV && (
                <CVDetail
                    cv={selectedCV}
                    onClose={handleCloseDetail}
                    onUpdateLikes={handleUpdateLikes}
                    onUpdateComments={handleUpdateComments}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
}

export default CVGallery;