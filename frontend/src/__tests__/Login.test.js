import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter as Router } from "react-router-dom";
import authReducer from "../redux/authSlice";
import bookReducer from "../redux/bookSlice";
import Login from "../pages/Login";

const renderWithRedux = (
  component,
  {
    initialState,
    store = configureStore({
      reducer: { auth: authReducer, books: bookReducer },
      preloadedState: initialState,
    }),
  } = {}
) => {
  return {
    ...render(
      <Provider store={store}>
        <Router>{component}</Router>
      </Provider>
    ),
  };
};

describe("Login Component", () => {
  test("renders Login form", () => {
    renderWithRedux(<Login />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mot de passe/i)).toBeInTheDocument();
  });
});
