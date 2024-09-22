import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "../redux/bookSlice";
import BookList from "../pages/BookList";

const renderWithStore = (initialState) => {
  const store = configureStore({
    reducer: {
      books: bookReducer,
      auth: (state = { user: null }) => state,
    },
    preloadedState: initialState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <BookList />
      </MemoryRouter>
    </Provider>
  );
};

describe("BookList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    renderWithStore({ books: { status: "loading" } });
    expect(screen.getByText(/Chargement.../)).toBeInTheDocument();
  });

  it("renders error state", () => {
    renderWithStore({
      books: { status: "failed", error: "Erreur de chargement" },
    });
    expect(
      screen.getByText(/Erreur: Erreur de chargement/)
    ).toBeInTheDocument();
  });

  it("renders login prompt when user is not logged in", () => {
    renderWithStore({ auth: { user: null } });
    expect(
      screen.getByText(/Veuillez vous connecter pour voir vos livres./)
    ).toBeInTheDocument();
  });

  it("renders the book list", () => {
    const initialState = {
      books: {
        books: [
          {
            _id: "1",
            title: "Book 1",
            author: "Author 1",
            status: "À lire",
            startDate: null,
            endDate: null,
          },
          {
            _id: "2",
            title: "Book 2",
            author: "Author 2",
            status: "En cours",
            startDate: null,
            endDate: null,
          },
        ],
        status: "succeeded",
        error: null,
      },
      auth: { user: { id: "user1", name: "User" } },
    };
    renderWithStore(initialState);

    expect(screen.getByText("Bibliothèque")).toBeInTheDocument();
    expect(screen.getByText("Book 1 par Author 1")).toBeInTheDocument();
    expect(screen.getByText("Book 2 par Author 2")).toBeInTheDocument();
  });
});
