import React from 'react';
import MovieCard from './MovieCard';
import { useDispatch, useSelector } from 'react-redux';
import { likeMovie, dislikeMovie } from '../features/movies/movieSlice';

const MovieList = ({ movies }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLike = (movieId) => {
    if (isAuthenticated) {
      dispatch(likeMovie(movieId));
    } else {
      alert('Please login to like movies.');
    }
  };

  const handleDislike = (movieId) => {
    if (isAuthenticated) {
      dispatch(dislikeMovie(movieId));
    } else {
      alert('Please login to dislike movies.');
    }
  };

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {movies.map((movie) => (
        <div className="col" key={movie._id}>
          <MovieCard
            movie={movie}
            onLike={handleLike}
            onDislike={handleDislike}
            likes={movie.likes}
            dislikes={movie.dislikes}
            isAuthenticated={isAuthenticated}
          />
        </div>
      ))}
    </div>
  );
};

export default MovieList;