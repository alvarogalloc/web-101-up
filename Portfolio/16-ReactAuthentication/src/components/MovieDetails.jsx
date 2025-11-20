import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addComment } from '../features/comments/commentSlice';

const MovieDetails = ({ movies }) => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { commentsByMovie } = useSelector((state) => state.comments);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const movie = movies.find((m) => m._id === _id);
  const currentMovieComments = commentsByMovie[_id] || [];

  useEffect(() => {
    if (_id) {
      dispatch(fetchComments(_id));
    }
  }, [_id, dispatch]);

  const handleAddComment = (commentText) => {
    if (isAuthenticated) {
      dispatch(addComment({ movieId: _id, text: commentText }));
    } else {
      alert('Please login to add comments.');
    }
  };

  if (!movie) {
    return (
      <div className="text-light text-center mt-5">
        <h2>Movie not found!</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Go Back
        </button>
      </div>
    );
  }

  const moviePoster = `/images/${movie.poster}`;

  return (
    <div className="container text-light my-5">
      <button className="btn btn-secondary mb-4" onClick={() => navigate('/')}>
        &larr; Back to Movies
      </button>
      <div className="row">
        <div className="col-md-4">
          <img
            src={moviePoster}
            alt={movie.title}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-8">
          <h1 className="display-4 mb-3">{movie.title}</h1>
          <p className="lead">{movie.best_character.bio}</p>
          <ul className="list-group list-group-flush bg-dark text-light">
            <li className="list-group-item bg-dark text-light">
              <strong>Episode:</strong> {movie.episode}
            </li>
            <li className="list-group-item bg-dark text-light">
              <strong>Year:</strong> {movie.year}
            </li>
          </ul>

          <h3 className="mt-5">Best Character:</h3>
          <div className="card bg-dark text-white">
            <img src={`/images/${movie.best_character.image}`} alt={movie.best_character.name} className="card-img-top" />
            <div className="card-body">
              <h5 className="card-title">{movie.best_character.name}</h5>
              <p className="card-text">Affiliation: {movie.best_character.affiliation}</p>
            </div>
          </div>

          <h3 className="mt-5">Comments:</h3>
          <CommentList comments={currentMovieComments} />
          {isAuthenticated ? (
            <CommentForm onAddComment={handleAddComment} />
          ) : (
            <p className="text-muted">Login to add comments.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;