import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/movies/';

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const likeMovie = createAsyncThunk(
  'movies/likeMovie',
  async (movieId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.patch(API_URL + `${movieId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const dislikeMovie = createAsyncThunk(
  'movies/dislikeMovie',
  async (movieId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.patch(API_URL + `${movieId}/dislike`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(likeMovie.fulfilled, (state, action) => {
        const index = state.movies.findIndex((movie) => movie._id === action.payload._id);
        if (index !== -1) {
          state.movies[index].likes = action.payload.likes;
        }
      })
      .addCase(dislikeMovie.fulfilled, (state, action) => {
        const index = state.movies.findIndex((movie) => movie._id === action.payload._id);
        if (index !== -1) {
          state.movies[index].dislikes = action.payload.dislikes;
        }
      });
  },
});

export default movieSlice.reducer;
