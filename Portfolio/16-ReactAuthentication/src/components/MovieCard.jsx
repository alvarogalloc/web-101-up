import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, onLike, onDislike, likes, dislikes, isAuthenticated }) => {
  const [isHovered, setIsHovered] = useState(false);
  const moviePoster = `/images/${movie.poster}`;
  const affiliation = movie.best_character.affiliation.toLowerCase();
  const affiliationImage = `/images/${affiliation}.png`;

  const getAffiliationColor = () => {
    if (affiliation === 'jedi' || affiliation === 'rebellion') {
      return 'bg-primary';
    } else if (affiliation === 'sith' || affiliation === 'empire') {
      return 'bg-danger';
    }
    return 'bg-secondary';
  };

  return (
    <div
      className="card bg-dark text-white h-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="position-relative">
        <img
          src={isHovered ? affiliationImage : moviePoster}
          alt={movie.title}
          className={`card-img-top ${isHovered ? getAffiliationColor() : ''}`}
          style={{ height: '400px', objectFit: 'cover' }}
        />
      </div>
      <div className="card-body">
        <h5 className="card-title">{movie.title}</h5>
        <p className="card-text">Release Year: {movie.year}</p>
        <div className="d-flex justify-content-between align-items-center mt-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => onLike(movie._id)}
                className="btn btn-success"
              >
                Like ({likes})
              </button>
              <button
                onClick={() => onDislike(movie._id)}
                className="btn btn-danger"
              >
                Dislike ({dislikes})
              </button>
            </>
          ) : (
            <p className="text-muted">Login to like/dislike</p>
          )}
        </div>
        <Link
          to={`/movie/${movie._id}`}
          className="btn btn-primary mt-4 w-100"
        >
          More...
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;