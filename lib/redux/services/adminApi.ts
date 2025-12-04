/**
 * Admin Dashboard API Service
 * Provides endpoints for admin overview statistics and analytics
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types
export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  new_users_this_week: number;
  new_users_percentage: number;
}

export interface RoleStats {
  role_name: string;
  role_slug: string;
  count: number;
  percentage: number;
}

export interface PaymentStats {
  total_transactions: number;
  total_revenue: string;
  pending_transactions: number;
  completed_transactions: number;
  failed_transactions: number;
  refunded_transactions: number;
  revenue_this_week: string;
  revenue_percentage_change: number;
  average_transaction: string;
  top_up_count: number;
  debit_count: number;
}

export interface RecentTransaction {
  id: string;
  user_email: string;
  user_name: string;
  amount: string;
  transaction_type: 'credit' | 'debit';
  payment_method: string;
  status: string;
  created_at: string;
}

export interface RecentActivity {
  id: string;
  actor: string;
  actor_email: string;
  action: string;
  target_type: string;
  target_id: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface SecurityOverview {
  active_sessions: number;
  login_attempts_today: number;
  failed_attempts_today: number;
  active_users_week: number;
  suspicious_activities: number;
  authentication_methods: {
    google: number;
    email: number;
  };
  two_factor_enabled: number;
  last_updated: string;
}

export interface UserSession {
  id: string;
  user: {
    id: string;
    email: string;
    full_name: string;
  };
  created_at: string;
  expires_at: string;
  last_activity: string | null;
  ip_address: string;
  user_agent: string;
}

export interface SessionsResponse {
  sessions: UserSession[];
  total: number;
  limit: number;
  offset: number;
}

export interface LoginHistoryItem {
  user: {
    id: string;
    email: string;
    full_name: string;
  };
  last_login: string | null;
  date_joined: string;
  is_active: boolean;
  authentication_method: string;
}

export interface LoginHistoryResponse {
  history: LoginHistoryItem[];
  total: number;
  limit: number;
}

export interface SecurityLog {
  id: string;
  event_type: string;
  user: {
    id: string;
    email: string;
    full_name: string;
  };
  timestamp: string;
  details: Record<string, any>;
}

export interface SecurityLogsResponse {
  logs: SecurityLog[];
  total: number;
}

export interface ActivitySummary {
  period: string;
  role_assignments: number;
  role_revocations: number;
  completed_transactions: number;
  failed_transactions: number;
  total_activities: number;
}

export interface AdminDashboardStats {
  user_stats: UserStats;
  role_distribution: RoleStats[];
  payment_stats: PaymentStats;
  recent_transactions: RecentTransaction[];
  recent_activities: RecentActivity[];
}

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AdminStats', 'PaymentStats', 'Activities', 'Security'],
  endpoints: (builder) => ({
    // Get comprehensive dashboard statistics
    getDashboardStats: builder.query<AdminDashboardStats, void>({
      query: () => '/admin/dashboard/stats/',
      providesTags: ['AdminStats'],
    }),

    // Get user statistics
    getUserStats: builder.query<UserStats, void>({
      query: () => '/rbac/users/stats/',
      providesTags: ['AdminStats'],
    }),

    // Get payment statistics
    getPaymentStats: builder.query<PaymentStats, void>({
      query: () => '/payments/stats/',
      providesTags: ['PaymentStats'],
    }),

    // Get recent transactions
    getRecentTransactions: builder.query<RecentTransaction[], { limit?: number }>({
      query: ({ limit = 10 }) => `/payments/transactions/recent/?limit=${limit}`,
      providesTags: ['PaymentStats'],
    }),

    // Get recent activities/audit log
    getRecentActivities: builder.query<RecentActivity[], { limit?: number }>({
      query: ({ limit = 10 }) => `/rbac/activities/recent/?limit=${limit}`,
      providesTags: ['Activities'],
    }),

    // Get activity summary
    getActivitySummary: builder.query<ActivitySummary, void>({
      query: () => '/rbac/activities/summary/',
      providesTags: ['Activities'],
    }),

    // Security endpoints
    getSecurityOverview: builder.query<SecurityOverview, void>({
      query: () => '/rbac/security/overview/',
      providesTags: ['Security'],
    }),

    getActiveSessions: builder.query<SessionsResponse, { limit?: number; offset?: number }>({
      query: ({ limit = 20, offset = 0 }) => 
        `/rbac/security/sessions/?limit=${limit}&offset=${offset}`,
      providesTags: ['Security'],
    }),

    revokeSession: builder.mutation<{ message: string; token_id: string }, { token_id: string }>({
      query: (data) => ({
        url: '/rbac/security/sessions/revoke/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Security'],
    }),

    revokeUserSessions: builder.mutation<{ message: string; user_id: string; revoked_count: number }, { user_id: string }>({
      query: (data) => ({
        url: '/rbac/security/sessions/revoke-user/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Security'],
    }),

    getLoginHistory: builder.query<LoginHistoryResponse, { limit?: number; user_id?: string }>({
      query: ({ limit = 50, user_id }) => {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (user_id) params.append('user_id', user_id);
        return `/rbac/security/login-history/?${params.toString()}`;
      },
      providesTags: ['Security'],
    }),

    getSecurityLogs: builder.query<SecurityLogsResponse, { limit?: number; event_type?: string }>({
      query: ({ limit = 50, event_type }) => {
        const params = new URLSearchParams({ limit: limit.toString() });
        if (event_type) params.append('event_type', event_type);
        return `/rbac/security/logs/?${params.toString()}`;
      },
      providesTags: ['Security'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUserStatsQuery,
  useGetPaymentStatsQuery,
  useGetRecentTransactionsQuery,
  useGetRecentActivitiesQuery,
  useGetActivitySummaryQuery,
  useGetSecurityOverviewQuery,
  useGetActiveSessionsQuery,
  useRevokeSessionMutation,
  useRevokeUserSessionsMutation,
  useGetLoginHistoryQuery,
  useGetSecurityLogsQuery,
} = adminApi;
