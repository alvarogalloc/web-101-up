import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from './features/movies/movieSlice';
import Auth from './components/Auth'; 
import Navbar from './components/Navbar'; 

function App() {
  const dispatch = useDispatch();
  const { movies, isLoading, error } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  if (isLoading) {
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
      <Navbar />
      <div className="container p-4">
        <h1 className="display-4 fw-bold text-center my-5">Teacher's fav movies: Star Wars Saga</h1>
        <Routes>
          <Route path="" element={<MovieList movies={movies} />} />
          <Route path="/movie/:_id" element={<MovieDetails movies={movies} />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
