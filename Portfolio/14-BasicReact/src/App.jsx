import { useState } from 'react';
import sw from '../public/data/data.js';
import MovieList from './components/MovieList';
import CharacterDetails from './components/CharacterDetails';
import './App.css';

function App() {
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [comments, setComments] = useState({});

  const handleLike = (movieId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [movieId]: (prevLikes[movieId] || 0) + 1,
    }));
  };

  const handleDislike = (movieId) => {
    setDislikes((prevDislikes) => ({
      ...prevDislikes,
      [movieId]: (prevDislikes[movieId] || 0) + 1,
    }));
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  const handleAddComment = (comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [selectedMovie.episode]: [...(prevComments[selectedMovie.episode] || []), comment],
    }));
  };

  return (
    <div className="bg-dark text-light">
      <div className="container p-4">
        <h1 className="display-4 fw-bold text-center my-5">Teacher's fav movies: Star Wars Saga</h1>
        <MovieList
          movies={sw}
          onLike={handleLike}
          onDislike={handleDislike}
          likes={likes}
          dislikes={dislikes}
          onMovieSelect={handleMovieSelect}
        />
        {selectedMovie && (
          <CharacterDetails
            character={selectedMovie.best_character}
            comments={comments[selectedMovie.episode] || []}
            onAddComment={handleAddComment}
          />
        )}
      </div>
    </div>
  );
}

export default App;
