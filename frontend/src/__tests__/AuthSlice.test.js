import authReducer, {
  login,
  register,
  setCredentials,
  clearCredentials,
} from "../redux/authSlice";

describe("authSlice", () => {
  const initialState = {
    user: null,
    token: null,
    status: "idle",
    error: null,
  };

  it("should return the initial state", () => {
    expect(authReducer(undefined, {})).toEqual(initialState);
  });

  describe("reducers", () => {
    it("should handle setCredentials", () => {
      const user = { id: 1, name: "John Doe" };
      const token = "abcd1234";

      const nextState = authReducer(
        initialState,
        setCredentials({ user, token })
      );

      expect(nextState.user).toEqual(user);
      expect(nextState.token).toEqual(token);
    });

    it("should handle clearCredentials", () => {
      const user = { id: 1, name: "John Doe" };
      const token = "abcd1234";
      const stateWithCredentials = { ...initialState, user, token };

      const nextState = authReducer(stateWithCredentials, clearCredentials());

      expect(nextState.user).toBeNull();
      expect(nextState.token).toBeNull();
    });
  });

  describe("async actions", () => {
    it("should handle login pending", () => {
      const nextState = authReducer(initialState, login.pending());
      expect(nextState.status).toBe("loading");
    });

    it("should handle login fulfilled", () => {
      const action = {
        type: login.fulfilled.type,
        payload: { user: { id: 1, name: "John Doe" }, token: "abcd1234" },
      };
      const nextState = authReducer(initialState, action);

      expect(nextState.status).toBe("succeeded");
      expect(nextState.user).toEqual(action.payload.user);
      expect(nextState.token).toEqual(action.payload.token);
    });

    it("should handle login rejected", () => {
      const action = {
        type: login.rejected.type,
        error: { message: "Login failed" },
      };
      const nextState = authReducer(initialState, action);

      expect(nextState.status).toBe("failed");
      expect(nextState.error).toBe("Login failed");
    });

    it("should handle register pending", () => {
      const nextState = authReducer(initialState, register.pending());
      expect(nextState.status).toBe("loading");
    });

    it("should handle register fulfilled", () => {
      const action = {
        type: register.fulfilled.type,
        payload: { user: { id: 2, name: "Jane Doe" }, token: "efgh5678" },
      };
      const nextState = authReducer(initialState, action);

      expect(nextState.status).toBe("succeeded");
      expect(nextState.user).toEqual(action.payload.user);
      expect(nextState.token).toEqual(action.payload.token);
    });

    it("should handle register rejected", () => {
      const action = {
        type: register.rejected.type,
        error: { message: "Registration failed" },
      };
      const nextState = authReducer(initialState, action);

      expect(nextState.status).toBe("failed");
      expect(nextState.error).toBe("Registration failed");
    });
  });
});
