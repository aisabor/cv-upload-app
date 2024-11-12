import React, { useState } from 'react';
import './CVDetail.css';

function CVDetail({ cv, onClose, onUpdateLikes, onUpdateComments, currentUser }) {
    const [likeStatus, setLikeStatus] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [zoom, setZoom] = useState(1);

    const handleLikeClick = () => {
        setLikeStatus(!likeStatus);
        onUpdateLikes(cv.id, !likeStatus, cv.likeCount); // Send updated like status
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            onUpdateComments(cv.id, newComment);
            setNewComment(''); // Clear the comment input after submission
        }
    };

    const handleZoomIn = () => setZoom(zoom + 0.1);
    const handleZoomOut = () => zoom > 0.5 && setZoom(zoom - 0.1);

    const renderFilePreview = () => {
        if (!cv.filePath) {
            return <p>File not available for preview.</p>;
        }

        const fileExtension = cv.filePath.split('.').pop().toLowerCase();
        const fileURL = `http://localhost:5001/uploads/${cv.filePath}`; // Correct URL for file access

        // PDF files embedded in an iframe
        if (fileExtension === 'pdf') {
            return (
                <iframe
                    src={fileURL}
                    style={{
                        width: '100%',
                        height: '500px',
                    }}
                    title="CV PDF"
                />
            );
        }
        // Image files with zoom functionality
        else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            return (
                <img
                    src={fileURL}
                    alt="Uploaded CV"
                    style={{
                        width: `${zoom * 100}%`,
                        height: 'auto',
                        transition: 'width 0.3s ease', // Smooth transition on zoom
                    }}
                />
            );
        }
        // If file type is unsupported
        else {
            return <p>File type not supported for preview.</p>;
        }
    };

    return (
        <div className="cv-detail-modal">
            <button className="close-button" onClick={onClose}>Close</button>
            <h2>{cv.title}</h2>
            <p>{cv.description}</p>
            <p>Uploaded by: {cv.uploadedBy}</p>
            <p>Likes: {cv.likeCount}</p>

            <button onClick={handleLikeClick}>
                {likeStatus ? 'Unlike' : 'Like'}
            </button>

            <div className="cv-viewer">
                <button onClick={handleZoomIn}>Zoom In</button>
                <button onClick={handleZoomOut}>Zoom Out</button>
                {renderFilePreview()}
            </div>

            <div className="comments-section">
                <h4>Comments</h4>
                <ul>
                    {(cv.comments || []).map((comment, index) => (
                        <li key={index}>{comment.content}</li>
                    ))}
                </ul>
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default CVDetail;
