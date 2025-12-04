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
  tagTypes: ['AdminStats', 'PaymentStats', 'Activities'],
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
      query: ({ limit = 10 }) => `/admin/activities/?limit=${limit}`,
      providesTags: ['Activities'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUserStatsQuery,
  useGetPaymentStatsQuery,
  useGetRecentTransactionsQuery,
  useGetRecentActivitiesQuery,
} = adminApi;
