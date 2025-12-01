import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  GoogleLoginRequest 
} from '@/lib/types/auth'; // Ensure this path matches your structure
import type { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.access;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/registration/',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    // [NEW] Google Login Endpoint
    googleLogin: builder.mutation<AuthResponse, GoogleLoginRequest>({
      query: (data) => ({
        url: '/auth/google/', 
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout/',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (body) => ({
        url: '/auth/token/refresh/',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGoogleLoginMutation, // Export the new hook
} = authApi;