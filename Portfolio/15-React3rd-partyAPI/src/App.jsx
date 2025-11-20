import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';

function App() {
  const [likes, setLikes] = useState(() => {
    const savedLikes = localStorage.getItem('likes');
    return savedLikes ? JSON.parse(savedLikes) : {};
  });
  const [dislikes, setDislikes] = useState(() => {
    const savedDislikes = localStorage.getItem('dislikes');
    return savedDislikes ? JSON.parse(savedDislikes) : {};
  });
  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem('comments');
    return savedComments ? JSON.parse(savedComments) : {};
  });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('likes', JSON.stringify(likes));
  }, [likes]);

  useEffect(() => {
    localStorage.setItem('dislikes', JSON.stringify(dislikes));
  }, [dislikes]);

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://swapi.dev/api/films/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const sortedMovies = data.results.sort((a, b) => a.episode_id - b.episode_id);
        setMovies(sortedMovies);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

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

  if (loading) {
    return (
      <div className="bg-dark text-light d-flex justify-content-center align-items-center vh-100">
        <h2 className="text-warning">Loading Star Wars Films...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark text-light d-flex justify-content-center align-items-center vh-100">
        <h2 className="text-danger">Error: {error.message}</h2>
      </div>
    );
  }

  return (
    <div className="bg-dark text-light">
      <div className="container p-4">
        <h1 className="display-4 fw-bold text-center my-5">Teacher's fav movies: Star Wars Saga</h1>
        <Routes>
          <Route
            path="/"
            element={
              <MovieList
                movies={movies}
                onLike={handleLike}
                onDislike={handleDislike}
                likes={likes}
                dislikes={dislikes}
              />
            }
          />
          <Route
            path="/movie/:episode_id"
            element={
              <MovieDetails
                movies={movies}
                comments={comments}
                setComments={setComments}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
