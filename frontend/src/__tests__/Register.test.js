import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Register from "../pages/Register";
import authReducer from "../redux/authSlice";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

const renderWithRedux = (
  component,
  {
    initialState,
    store = configureStore({
      reducer: { auth: authReducer },
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

describe("Register Component", () => {
  test("renders registration form", () => {
    renderWithRedux(<Register />);

    expect(
      screen.getByPlaceholderText(/nom d'utilisateur/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mot de passe/i)).toBeInTheDocument();
  });

  test("submits form with valid data", async () => {
    const responseData = {
      token: "fake_token",
      user: { username: "testuser" },
    };
    axios.post.mockResolvedValueOnce({ data: responseData });

    renderWithRedux(<Register />);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/nom d'utilisateur/i), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByText(/s'inscrire/i));
    });

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/api/auth/register",
      {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      }
    );
  });

  test("handles registration error", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Erreur d'inscription" } },
    });

    renderWithRedux(<Register />);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/nom d'utilisateur/i), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByText(/s'inscrire/i));
    });

    expect(screen.getByText("Erreur d'inscription")).toBeInTheDocument();
  });
});
