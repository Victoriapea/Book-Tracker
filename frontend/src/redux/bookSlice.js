import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { getState }) => {
    const { token } = getState().auth;
    if (!token) {
      throw new Error("No token found");
    }
    const response = await axios.get(`${API_URL}/books`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const addBook = createAsyncThunk(
  "books/addBook",
  async (bookData, { getState }) => {
    const { token } = getState().auth;
    if (!token) {
      throw new Error("No token found");
    }
    const response = await axios.post(`${API_URL}/books`, bookData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ id, bookData }, { getState }) => {
    const { token } = getState().auth;
    const response = await axios.put(`${API_URL}/books/${id}`, bookData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id, { getState }) => {
    const { token } = getState().auth;
    await axios.delete(`${API_URL}/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex(
          (book) => book._id === action.payload._id
        );
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter((book) => book._id !== action.payload);
      });
  },
});

export default bookSlice.reducer;
