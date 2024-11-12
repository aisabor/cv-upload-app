import React, { useState } from 'react';

const CVList = ({ cvs, onCommentSubmit }) => {
    return (
        <div className="cv-list">
            {cvs.map((cv) => (
                <div key={cv.id} className="cv-card">
                    <h4>{cv.name}</h4>
                    <a href={cv.url} target="_blank" rel="noopener noreferrer">View CV</a>
                    
                    {/* Comment section */}
                    <CommentSection cvId={cv.id} onCommentSubmit={onCommentSubmit} />
                </div>
            ))}
        </div>
    );
};

const CommentSection = ({ cvId, onCommentSubmit }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (comment.trim()) {
            onCommentSubmit(cvId, comment);
            setComment(''); // Clear the input after submission
        }
    };

    return (
        <div className="like-comment-section">
            <form onSubmit={handleSubmit}>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Leave a comment"
                    rows="3" // Fixed here
                />
                <button type="submit">Comment</button>
            </form>
        </div>
    );
};

export default CVList;
