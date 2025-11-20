import React, { useState } from 'react';

const CommentForm = ({ onAddComment }) => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && comment) {
      onAddComment({ name, comment });
      setName('');
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control bg-dark text-white"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="comment" className="form-label">
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="form-control bg-dark text-white"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
      >
        Add Comment
      </button>
    </form>
  );
};

export default CommentForm;
