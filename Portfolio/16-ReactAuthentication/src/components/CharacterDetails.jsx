import React from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const CharacterDetails = ({ character, comments, onAddComment }) => {
  if (!character) {
    return null;
  }

  return (
    <div className="card bg-dark text-white mt-5">
      <div className="card-body">
        <h2 className="card-title display-5">{character.name}</h2>
        <div className="row">
          <div className="col-md-4">
            <img
              src={`/images/${character.image}`}
              alt={character.name}
              className="img-fluid rounded"
            />
          </div>
          <div className="col-md-8">
            <p className="card-text">{character.bio}</p>
          </div>
        </div>
        <CommentList comments={comments} />
        <CommentForm onAddComment={onAddComment} />
      </div>
    </div>
  );
};

export default CharacterDetails;
