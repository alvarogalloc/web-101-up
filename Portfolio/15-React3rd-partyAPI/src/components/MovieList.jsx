import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ movies, onLike, onDislike, likes, dislikes }) => { // Removed onMovieSelect
  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {movies.map((movie) => (
        <div className="col" key={movie.episode_id}>
          <MovieCard
            movie={movie}
            onLike={onLike}
            onDislike={onDislike}
            likes={likes[movie.episode_id] || 0}
            dislikes={dislikes[movie.episode_id] || 0}
          />
        </div>
      ))}
    </div>
  );
};

export default MovieList;
