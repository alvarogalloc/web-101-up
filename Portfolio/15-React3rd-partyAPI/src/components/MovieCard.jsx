import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const movieImageMap = {
  4: 'SW4-A_new_hope.jpg',
  5: 'SW5-The_empire_strikes_back.jpg',
  6: 'SW6-The_return_of_the_jedi.jpg',
  1: 'SW1-The_phantom_menace.jpg',
  2: 'SW2-Attack_of_the_Clones.jpg',
  3: 'SW3-Revenge_of_the_sith.jpg',
};

const movieAffiliationMap = {
  1: 'jedi',
  2: 'jedi',
  3: 'sith',
  4: 'rebellion',
  5: 'rebellion',
  6: 'rebellion',
};

const MovieCard = ({ movie, onLike, onDislike, likes, dislikes }) => {
  const [isHovered, setIsHovered] = useState(false);
  const moviePoster = `/images/${movieImageMap[movie.episode_id] || 'default.jpg'}`;
  const affiliation = movieAffiliationMap[movie.episode_id] || 'rebellion';
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
        <p className="card-text">Release Date: {movie.release_date}</p>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            onClick={() => onLike(movie.episode_id)}
            className="btn btn-success"
          >
            Like ({likes})
          </button>
          <button
            onClick={() => onDislike(movie.episode_id)}
            className="btn btn-danger"
          >
            Dislike ({dislikes})
          </button>
        </div>
        <Link
          to={`/movie/${movie.episode_id}`}
          className="btn btn-primary mt-4 w-100"
        >
          More...
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
