import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const movieImageMap = {
  4: 'SW4-A_new_hope.jpg',
  5: 'SW5-The_empire_strikes_back.jpg',
  6: 'SW6-The_return_of_the_jedi.jpg',
  1: 'SW1-The_phantom_menace.jpg',
  2: 'SW2-Attack_of_the_Clones.jpg',
  3: 'SW3-Revenge_of_the_sith.jpg',
};

const MovieDetails = ({ movies, comments, setComments }) => {
  const { episode_id } = useParams();
  const navigate = useNavigate();
  const movie = movies.find((m) => m.episode_id === parseInt(episode_id));
  const [characters, setCharacters] = useState([]);
  const [loadingCharacters, setLoadingCharacters] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      if (movie) {
        setLoadingCharacters(true);
        const characterPromises = movie.characters.map((charUrl) =>
          fetch(charUrl).then((res) => res.json())
        );
        const characterData = await Promise.all(characterPromises);
        setCharacters(characterData);
        setLoadingCharacters(false);
      }
    };

    fetchCharacters();
  }, [movie]);

  const handleAddComment = (comment) => {
    setComments((prevComments) => ({
      ...prevComments,
      [episode_id]: [...(prevComments[episode_id] || []), comment],
    }));
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

  const moviePoster = `/images/${movieImageMap[movie.episode_id] || 'default.jpg'}`;

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
          <p className="lead">{movie.opening_crawl}</p>
          <ul className="list-group list-group-flush bg-dark text-light">
            <li className="list-group-item bg-dark text-light">
              <strong>Episode:</strong> {movie.episode_id}
            </li>
            <li className="list-group-item bg-dark text-light">
              <strong>Director:</strong> {movie.director}
            </li>
            <li className="list-group-item bg-dark text-light">
              <strong>Producer:</strong> {movie.producer}
            </li>
            <li className="list-group-item bg-dark text-light">
              <strong>Release Date:</strong> {movie.release_date}
            </li>
          </ul>

          <h3 className="mt-5">Characters:</h3>
          {loadingCharacters ? (
            <p>Loading characters...</p>
          ) : (
            <ul className="list-group list-group-flush bg-dark text-light">
              {characters.map((char, index) => (
                <li key={index} className="list-group-item bg-dark text-light">
                  {char.name}
                </li>
              ))}
            </ul>
          )}

          <h3 className="mt-5">Comments:</h3>
          <CommentList comments={comments[episode_id] || []} />
          <CommentForm onAddComment={handleAddComment} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
