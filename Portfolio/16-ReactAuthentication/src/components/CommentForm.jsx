import React, { useState } from 'react';

const CommentForm = ({ onAddComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-3">
        <label htmlFor="comment" className="form-label">
          Add a Comment
        </label>
        <textarea
          id="comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="form-control bg-dark text-white"
          rows="3"
          required
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
      >
        Submit Comment
      </button>
    </form>
  );
};

export default CommentForm;