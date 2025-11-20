import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  useEffect( () => {
    if (isAuthenticated) {
      const apiseed =async () => {

        console.log("seeding the api to avoid overfetching swapi")
      const API_URL = 'http://localhost:5000/api/movies/seed';
      const response = await axios.post(API_URL);
      };
      apiseed();

      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ username, password }));
    } else {
      dispatch(registerUser({ username, password }));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card bg-dark text-light">
            <div className="card-header text-center">
              <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="alert alert-danger">{error.message || error}</div>}
                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                  {isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
                </button>
              </form>
              <p className="mt-3 text-center">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <span
                  className="text-primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
