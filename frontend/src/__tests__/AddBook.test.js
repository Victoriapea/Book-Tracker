import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter as Router } from "react-router-dom";
import AddBook from "../pages/AddBook";
import bookReducer, { addBook } from "../redux/bookSlice";

const mockDispatch = jest.fn();
const store = configureStore({
  reducer: {
    books: bookReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat((store) => (next) => (action) => {
      mockDispatch(action);
      return next(action);
    }),
});

beforeAll(() => {
  window.alert = jest.fn();
});

describe("AddBook Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <Provider store={store}>
        <Router>
          <AddBook />
        </Router>
      </Provider>
    );
  });

  test("renders AddBook form", () => {
    expect(screen.getByPlaceholderText(/titre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/auteur/i)).toBeInTheDocument();
  });

  test("adds a book successfully", () => {
    fireEvent.change(screen.getByPlaceholderText(/titre/i), {
      target: { value: "Harry Potter" },
    });
    fireEvent.change(screen.getByPlaceholderText(/auteur/i), {
      target: { value: "J.K. Rowling" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: /statut/i }), {
      target: { value: "À lire" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ajouter/i }));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: addBook.pending.type,
        meta: expect.any(Object),
        payload: undefined,
      })
    );

    expect(window.alert).toHaveBeenCalledWith("Livre ajouté avec succès!");
  });

  test("shows error when endDate is before startDate", () => {
    fireEvent.change(screen.getByPlaceholderText(/titre/i), {
      target: { value: "Test Book" },
    });
    fireEvent.change(screen.getByPlaceholderText(/auteur/i), {
      target: { value: "Test Author" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: /statut/i }), {
      target: { value: "En cours" },
    });
    fireEvent.change(screen.getByLabelText(/date de début/i), {
      target: { value: "2024-09-15" },
    });
    fireEvent.change(screen.getByLabelText(/date de fin/i), {
      target: { value: "2024-09-10" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ajouter/i }));

    expect(
      screen.getByText(
        /la date de fin ne peut pas être antérieure à la date de début/i
      )
    ).toBeInTheDocument();
  });
});
