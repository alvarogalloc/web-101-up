import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ movies, onMovieSelect, onLike, onDislike, likes, dislikes }) => {
  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {movies.map((movie) => (
        <div className="col" key={movie.episode}>
          <MovieCard
            movie={movie}
            onMovieSelect={onMovieSelect}
            onLike={onLike}
            onDislike={onDislike}
            likes={likes[movie.episode] || 0}
            dislikes={dislikes[movie.episode] || 0}
          />
        </div>
      ))}
    </div>
  );
};

export default MovieList;
