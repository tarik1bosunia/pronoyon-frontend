import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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

export interface UserRole {
  id: number;
  role: {
    id: number;
    name: string;
    slug: string;
    role_type: string;
    level: number;
  };
  is_primary: boolean;
  is_active: boolean;
  assigned_at: string;
  expires_at?: string | null;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  roles: UserRole[];
  primary_role: {
    id: number;
    name: string;
    slug: string;
    role_type: string;
    level: number;
  } | null;
}

export interface UserCreateRequest {
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  role_id?: number;
  password?: string;
}

export interface UserUpdateRequest {
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  role_id?: number;
}

export interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export interface UserStatsResponse {
  total_users: number;
  active_users: number;
  inactive_users: number;
  role_distribution: Record<string, number>;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery,
  tagTypes: ['User', 'UserStats'],
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, { 
      search?: string; 
      role?: string; 
      is_active?: boolean;
      page?: number;
    }>({
      query: ({ search, role, is_active, page = 1 }) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (role) params.append('role', role);
        if (is_active !== undefined) params.append('is_active', is_active.toString());
        params.append('page', page.toString());
        
        return {
          url: `/rbac/users/?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['User'],
    }),
    
    getUser: builder.query<User, number>({
      query: (id) => ({
        url: `/rbac/users/${id}/`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
    
    createUser: builder.mutation<User, UserCreateRequest>({
      query: (data) => ({
        url: '/rbac/users/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User', 'UserStats'],
    }),
    
    updateUser: builder.mutation<User, { id: number; data: UserUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/rbac/users/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }, 'User', 'UserStats'],
    }),
    
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/rbac/users/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'UserStats'],
    }),
    
    activateUser: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/rbac/users/${id}/activate/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'User', id }, 'User', 'UserStats'],
    }),
    
    deactivateUser: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/rbac/users/${id}/deactivate/`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'User', id }, 'User', 'UserStats'],
    }),
    
    getUserStats: builder.query<UserStatsResponse, void>({
      query: () => ({
        url: '/rbac/users/stats/',
        method: 'GET',
      }),
      providesTags: ['UserStats'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useGetUserStatsQuery,
} = usersApi;
