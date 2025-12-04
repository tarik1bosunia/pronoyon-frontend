/**
 * Payments & Wallet API Service
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Types
export interface WalletBalance {
  id: string;
  user: string;
  user_email: string;
  user_name: string;
  balance: string;
  total_credited: string;
  total_debited: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet: string;
  user_email: string;
  transaction_type: 'credit' | 'debit';
  amount: string;
  payment_method: 'bkash' | 'nagad' | 'rocket' | 'bank';
  payment_method_display: string;
  gateway_transaction_id: string;
  gateway_response: Record<string, any>;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  status_display: string;
  description: string;
  balance_after: string;
  verified_by: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface PaymentTransaction {
  id: string;
  user: string;
  user_email: string;
  wallet: string;
  amount: string;
  mcq_count: number;
  cq_count: number;
  total_questions: number;
  mcq_price_per_question: string;
  cq_price_per_question: string;
  draft: string | null;
  pdf_file: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  status_display: string;
  balance_after: string;
  wallet_transaction: string | null;
  created_at: string;
}

export interface TopUpRequest {
  amount: number;
  payment_method: 'bkash' | 'nagad' | 'rocket' | 'bank';
}

export interface TopUpResponse {
  success: boolean;
  transaction_id: string;
  payment_id: string;
  bkash_url: string;
  amount: string;
  message: string;
}

export interface PaymentExecuteRequest {
  payment_id: string;
}

export interface PaymentExecuteResponse {
  success: boolean;
  transaction_id: string;
  trx_id: string;
  amount: string;
  new_balance: string;
  message: string;
}

export interface PaymentQueryRequest {
  payment_id: string;
}

export interface PaymentQueryResponse {
  success: boolean;
  payment_id: string;
  trx_id: string;
  status: string;
  amount: string;
}

export const paymentsApi = createApi({
  reducerPath: 'paymentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/payments/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Wallet', 'WalletTransactions', 'Payments'],
  endpoints: (builder) => ({
    // Get wallet balance
    getWallet: builder.query<WalletBalance, void>({
      query: () => 'wallets/',
      providesTags: ['Wallet'],
      transformResponse: (response: WalletBalance | WalletBalance[]) => {
        // API returns array with single wallet
        return Array.isArray(response) ? response[0] : response;
      },
    }),

    // Get wallet transactions
    getWalletTransactions: builder.query<WalletTransaction[], { walletId: string; status?: string; type?: string }>({
      query: ({ walletId, status, type }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (type) params.append('type', type);
        return `wallets/${walletId}/transactions/?${params.toString()}`;
      },
      providesTags: ['WalletTransactions'],
    }),

    // Initiate wallet top-up
    topUpWallet: builder.mutation<TopUpResponse, { walletId: string; data: TopUpRequest }>({
      query: ({ walletId, data }) => ({
        url: `wallets/${walletId}/topup/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wallet', 'WalletTransactions'],
    }),

    // Execute payment after bKash flow
    executePayment: builder.mutation<PaymentExecuteResponse, PaymentExecuteRequest>({
      query: (data) => ({
        url: 'transactions/execute/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wallet', 'WalletTransactions'],
    }),

    // Query payment status
    queryPayment: builder.mutation<PaymentQueryResponse, PaymentQueryRequest>({
      query: (data) => ({
        url: 'transactions/query/',
        method: 'POST',
        body: data,
      }),
    }),

    // Get payment history
    getPayments: builder.query<PaymentTransaction[], void>({
      query: () => 'transactions/',
      providesTags: ['Payments'],
    }),

    // Refund transaction (admin only)
    refundTransaction: builder.mutation<any, { transaction_id: string; reason: string }>({
      query: (data) => ({
        url: 'transactions/refund/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wallet', 'WalletTransactions'],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useGetWalletTransactionsQuery,
  useTopUpWalletMutation,
  useExecutePaymentMutation,
  useQueryPaymentMutation,
  useGetPaymentsQuery,
  useRefundTransactionMutation,
} = paymentsApi;
