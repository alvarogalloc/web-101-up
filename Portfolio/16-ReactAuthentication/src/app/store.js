import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import movieReducer from '../features/movies/movieSlice';
import commentReducer from '../features/comments/commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    comments: commentReducer,
  },
});
