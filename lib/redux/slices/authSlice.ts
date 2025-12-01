import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, AuthTokens } from '@/types/auth';

const initialState: AuthState = {
  user: null,
  access: null,
  refresh: null,
  isAuthenticated: false,
};

const buildCookie = (name: string, value: string, maxAgeSeconds: number) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const secureFlag = isProduction ? '; Secure' : '';
  const sameSite = '; SameSite=Lax';
  return `${name}=${value}; path=/; max-age=${maxAgeSeconds}${secureFlag}${sameSite}`;
};

// Load auth state from localStorage on initialization (client-side only)
const loadAuthState = (): AuthState => {
  if (typeof window === 'undefined') return initialState;
  
  try {
    const access = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    const userStr = localStorage.getItem('user');
    
    if (access && refresh && userStr) {
      document.cookie = buildCookie('access_token', access, 60 * 60);
      document.cookie = buildCookie('refresh_token', refresh, 60 * 60 * 24 * 7);
      
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

        document.cookie = buildCookie('access_token', access, 60 * 60);
        document.cookie = buildCookie('refresh_token', refresh, 60 * 60 * 24 * 7);
      }
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.access = action.payload;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', action.payload);

        document.cookie = buildCookie('access_token', action.payload, 60 * 60);
      }
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
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
        
        // Clear cookies
        document.cookie = buildCookie('access_token', '', 0);
        document.cookie = buildCookie('refresh_token', '', 0);
      }
    },
  },
});

export const { setCredentials, updateAccessToken, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
