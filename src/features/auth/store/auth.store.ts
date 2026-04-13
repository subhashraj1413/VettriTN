import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthState, Session } from '../types';

const initialState: AuthState = {
  hydrated: false,
  isAuthenticated: false,
  session: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    finishHydration(state) {
      state.hydrated = true;
    },
    hydrateSession(state, action: PayloadAction<Session | null>) {
      state.hydrated = true;
      state.isAuthenticated = Boolean(action.payload);
      state.session = action.payload;
    },
    setSession(state, action: PayloadAction<Session>) {
      state.hydrated = true;
      state.isAuthenticated = true;
      state.session = action.payload;
    },
    signOut(state) {
      state.hydrated = true;
      state.isAuthenticated = false;
      state.session = null;
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;

