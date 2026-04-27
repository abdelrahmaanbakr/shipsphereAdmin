import { createSlice } from "@reduxjs/toolkit";

export interface Admin {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthState {
  user: Admin | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: { _id: "local", fullName: "Admin", email: "admin@shipsphere.com", role: "admin" },
  accessToken: "bypass",
  loading: false,
  error: null,
  isAuthenticated: true,
  isHydrated: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAccessToken: (state) => { state.isHydrated = true; },
    setAccessToken: () => {},
    logout: () => {},
    clearError: (state) => { state.error = null; },
  },
});

export const { hydrateAccessToken, setAccessToken, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
