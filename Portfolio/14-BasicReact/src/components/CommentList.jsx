import React from 'react';

const CommentList = ({ comments }) => {
  return (
    <div className="mt-5">
      <h3 className="h5">Comments</h3>
      {comments.map((comment, index) => (
        <div key={index} className="card bg-dark text-white my-3">
          <div className="card-body">
            <h5 className="card-title">{comment.name}</h5>
            <p className="card-text">{comment.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
