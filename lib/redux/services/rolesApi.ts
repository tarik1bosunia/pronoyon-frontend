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

export interface Permission {
  id: number;
  name: string;
  codename: string;
  description: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string;
  role_type: string;
  level: number;
  permissions: Permission[];
  all_permissions: Permission[];
  inherits_from: number | null;
  is_active: boolean;
  is_default: boolean;
  max_users: number | null;
  user_count: number;
  created_at: string;
  updated_at: string;
}

export interface RoleCreateUpdateRequest {
  name: string;
  slug?: string;
  description?: string;
  role_type?: string;
  level?: number;
  permission_ids?: number[];
  inherits_from?: number | null;
  is_active?: boolean;
  is_default?: boolean;
  max_users?: number | null;
}

export interface RoleListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Role[];
}

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery,
  tagTypes: ['Role', 'Permission'],
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], void>({
      query: () => '/rbac/roles/',
      transformResponse: (response: Role[] | { results: Role[] }) => {
        // Handle both array and paginated response
        return Array.isArray(response) ? response : response.results || [];
      },
      providesTags: ['Role'],
    }),
    
    getRole: builder.query<Role, string>({
      query: (slug) => `/rbac/roles/${slug}/`,
      providesTags: (_result, _error, slug) => [{ type: 'Role', id: slug }],
    }),
    
    createRole: builder.mutation<Role, RoleCreateUpdateRequest>({
      query: (data) => ({
        url: '/rbac/roles/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Role'],
    }),
    
    updateRole: builder.mutation<Role, { slug: string; data: RoleCreateUpdateRequest }>({
      query: ({ slug, data }) => ({
        url: `/rbac/roles/${slug}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { slug }) => [{ type: 'Role', id: slug }, 'Role'],
    }),
    
    deleteRole: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/rbac/roles/${slug}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),
    
    getPermissions: builder.query<Permission[], void>({
      query: () => '/rbac/permissions/',
      transformResponse: (response: Permission[] | { results: Permission[] }) => {
        // Handle both array and paginated response
        return Array.isArray(response) ? response : response.results || [];
      },
      providesTags: ['Permission'],
    }),
    
    getPermissionsByCategory: builder.query<Record<string, Permission[]>, void>({
      query: () => '/rbac/permissions/by_category/',
      providesTags: ['Permission'],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
  useGetPermissionsByCategoryQuery,
} = rolesApi;
