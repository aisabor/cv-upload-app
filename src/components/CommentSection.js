import React, { useState } from 'react';

function CommentSection({ cv }) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(cv.comments || []);
    
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (comment) {
            setComments((prevComments) => [...prevComments, comment]);
            setComment('');
        }
    };

    return (
        <div>
            <h4>Comments</h4>
            <form onSubmit={handleCommentSubmit}>
                <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Leave a comment"
                    required
                />
                <button type="submit">Submit</button>
            </form>
            <ul>
                {comments.map((c, index) => (
                    <li key={index}>{c}</li>
                ))}
            </ul>
        </div>
    );
}

export default CommentSection;
