import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, AuthTokens } from '@/types/auth';

const initialState: AuthState = {
  user: null,
  access: null,
  refresh: null,
  isAuthenticated: false,
};

// Load auth state from localStorage on initialization (client-side only)
const loadAuthState = (): AuthState => {
  if (typeof window === 'undefined') return initialState;
  
  try {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    const userStr = localStorage.getItem('user');
    
    if (access && refresh && userStr) {
      return {
        user: JSON.parse(userStr),
        access,
        refresh,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Failed to load auth state:', error);
  }
  
  return initialState;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; access: string; refresh: string }>
    ) => {
      const { user, access, refresh } = action.payload;
      state.user = user;
      state.access = access;
      state.refresh = refresh;
      state.isAuthenticated = true;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.access = action.payload;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', action.payload);
      }
    },
    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
    },
  },
});

export const { setCredentials, updateAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
