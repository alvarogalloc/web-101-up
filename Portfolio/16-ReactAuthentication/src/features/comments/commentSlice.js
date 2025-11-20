import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/comments/';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (movieId, thunkAPI) => {
    try {
      const response = await axios.get(API_URL + movieId);
      return { movieId, comments: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ movieId, text }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(API_URL + movieId, { text }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { movieId, comment: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    commentsByMovie: {}, // { movieId: [comment1, comment2] }
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.commentsByMovie[action.payload.movieId] = action.payload.comments;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { movieId, comment } = action.payload;
        if (!state.commentsByMovie[movieId]) {
          state.commentsByMovie[movieId] = [];
        }
        state.commentsByMovie[movieId].push(comment);
      });
  },
});

export default commentSlice.reducer;
