import bookReducer, {
  fetchBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../redux/bookSlice";

describe("bookSlice", () => {
  const initialState = {
    books: [],
    status: "idle",
    error: null,
  };

  it("should return the initial state", () => {
    expect(bookReducer(undefined, {})).toEqual(initialState);
  });

  describe("async actions", () => {
    const mockState = {
      auth: { token: "test_token" },
    };

    it("should handle fetchBooks pending", () => {
      const nextState = bookReducer(initialState, fetchBooks.pending());
      expect(nextState.status).toBe("loading");
    });

    it("should handle fetchBooks fulfilled", () => {
      const action = {
        type: fetchBooks.fulfilled.type,
        payload: [
          { _id: "1", title: "Book 1" },
          { _id: "2", title: "Book 2" },
        ],
      };
      const nextState = bookReducer(initialState, action);

      expect(nextState.status).toBe("succeeded");
      expect(nextState.books).toEqual(action.payload);
    });

    it("should handle fetchBooks rejected", () => {
      const action = {
        type: fetchBooks.rejected.type,
        error: { message: "Fetch failed" },
      };
      const nextState = bookReducer(initialState, action);

      expect(nextState.status).toBe("failed");
      expect(nextState.error).toBe("Fetch failed");
    });

    it("should handle addBook fulfilled", () => {
      const action = {
        type: addBook.fulfilled.type,
        payload: { _id: "3", title: "Book 3" },
      };
      const nextState = bookReducer(initialState, action);

      expect(nextState.books).toContainEqual(action.payload);
    });

    it("should handle updateBook fulfilled", () => {
      const initialStateWithBooks = {
        ...initialState,
        books: [{ _id: "1", title: "Book 1" }],
      };
      const action = {
        type: updateBook.fulfilled.type,
        payload: { _id: "1", title: "Updated Book 1" },
      };
      const nextState = bookReducer(initialStateWithBooks, action);

      expect(nextState.books[0].title).toBe("Updated Book 1");
    });

    it("should handle deleteBook fulfilled", () => {
      const initialStateWithBooks = {
        ...initialState,
        books: [
          { _id: "1", title: "Book 1" },
          { _id: "2", title: "Book 2" },
        ],
      };
      const action = {
        type: deleteBook.fulfilled.type,
        payload: "1",
      };
      const nextState = bookReducer(initialStateWithBooks, action);

      expect(nextState.books).toHaveLength(1);
      expect(nextState.books).not.toContainEqual({ _id: "1", title: "Book 1" });
    });
  });
});
