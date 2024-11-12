// src/components/CVModal.js
import React, { useState } from 'react';

function CVModal({ cv, onClose }) {
    const [likes, setLikes] = useState(0); // State for likes
    const [comments, setComments] = useState([]); // State for comments
    const [commentText, setCommentText] = useState(''); // State for new comment text

    const handleLike = () => setLikes(likes + 1);

    const handleAddComment = () => {
        if (commentText.trim()) {
            setComments([...comments, commentText]);
            setCommentText(''); // Clear the input field after adding a comment
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>X</button>
                <h3>{cv.name}</h3>
                <p>{cv.description}</p>
                
                <div className="cv-viewer">
                    <iframe
                        src={URL.createObjectURL(cv.file)}
                        title="CV Preview"
                        width="100%"
                        height="400px"
                    />
                </div>
                
                <div className="like-comment-section">
                    <div className="like-section">
                        <button onClick={handleLike}>Like</button>
                        <span className="like-count">({likes})</span>
                    </div>
                    
                    <div className="comments">
                        <h4>Comments</h4>
                        <div className="comments-list">
                            {comments.map((comment, index) => (
                                <p key={index}>{comment}</p>
                            ))}
                        </div>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment"
                            rows="2"
                        ></textarea>
                        <button className="add-comment-btn" onClick={handleAddComment}>Add Comment</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CVModal;
