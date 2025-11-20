import React from 'react';

const CommentList = ({ comments }) => {
  return (
    <div className="mt-5">
      <h3 className="h5">Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="card bg-dark text-white my-3">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">
                {comment.user ? comment.user.username : 'Anonymous'}
              </h6>
              <p className="card-text">{comment.text}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;