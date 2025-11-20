import React, { useState } from 'react';

const MovieCard = ({ movie, onMovieSelect, onLike, onDislike, likes, dislikes }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getAffiliationColor = () => {
    const affiliation = movie.best_character.affiliation.toLowerCase();
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
          src={isHovered ? `/images/${movie.best_character.affiliation.toLowerCase()}.png` : `/images/${movie.poster}`}
          alt={movie.title}
          className={`card-img-top ${isHovered ? getAffiliationColor() : ''}`}
          style={{ height: '400px', objectFit: 'cover' }}
        />
      </div>
      <div className="card-body">
        <h5 className="card-title">{movie.title}</h5>
        <p className="card-text">{movie.year}</p>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            onClick={() => onLike(movie.episode)}
            className="btn btn-success"
          >
            Like ({likes})
          </button>
          <button
            onClick={() => onDislike(movie.episode)}
            className="btn btn-danger"
          >
            Dislike ({dislikes})
          </button>
        </div>
        <button
          onClick={() => onMovieSelect(movie)}
          className="btn btn-primary mt-4 w-100"
        >
          More...
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
