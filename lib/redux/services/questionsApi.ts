import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Question {
  id: string;
  type: 'mcq' | 'cq';
  text: string;
  stem?: string;
  romanStatements?: string[];
  footer?: string;
  marks: number;
  board: string;
  year: string;
  subject: string;
  chapter: string;
  topic: string;
  school: string;
  schoolYear: string;
  specialTags: string[];
  options?: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  subQuestions?: Array<{
    id: string;
    label: string;
    text: string;
    marks: number;
  }>;
}

export interface QuestionsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Question[];
}

export interface UserDraft {
  id: string;
  title: string;
  description: string;
  is_favorite: boolean;
  question_count: number;
  created_at: string;
  updated_at: string;
}

export interface DraftsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserDraft[];
}

export interface DraftQuestion {
  id: string;
  question: Question;
  order: number;
  notes: string;
  added_at: string;
}

export interface DraftDetailResponse extends UserDraft {
  questions: DraftQuestion[];
}

export interface UserStats {
  total_drafts: number;
  total_questions_completed: number;
  questions_this_week: number;
  average_accuracy: number;
}

export const questionsApi = createApi({
  reducerPath: 'questionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/questions/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Question', 'Draft'],
  endpoints: (builder) => ({
    getQuestions: builder.query<QuestionsListResponse, {
      page?: number;
      page_size?: number;
      type?: string;
      difficulty?: string;
      subject_id?: string;
      search?: string;
    }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString());
          }
        });
        return `questions/?${searchParams.toString()}`;
      },
      providesTags: ['Question'],
    }),
    
    // User Drafts endpoints
    getUserDrafts: builder.query<DraftsListResponse, {
      page?: number;
      page_size?: number;
      search?: string;
    }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString());
          }
        });
        return `drafts/?${searchParams.toString()}`;
      },
      providesTags: ['Draft'],
    }),

    getDraftDetail: builder.query<DraftDetailResponse, string>({
      query: (draftId) => `drafts/${draftId}/`,
      providesTags: ['Draft'],
    }),

    createDraft: builder.mutation<UserDraft, { title: string; description?: string }>({
      query: (body) => ({
        url: 'drafts/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Draft'],
    }),

    updateDraft: builder.mutation<UserDraft, { id: string; title?: string; description?: string; is_favorite?: boolean }>({
      query: ({ id, ...body }) => ({
        url: `drafts/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Draft'],
    }),

    deleteDraft: builder.mutation<void, string>({
      query: (draftId) => ({
        url: `drafts/${draftId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Draft'],
    }),

    addQuestionToDraft: builder.mutation<DraftQuestion, { draftId: string; questionId: string; notes?: string }>({
      query: ({ draftId, questionId, notes }) => ({
        url: `drafts/${draftId}/add_question/`,
        method: 'POST',
        body: { question_id: questionId, notes },
      }),
      invalidatesTags: ['Draft'],
    }),

    removeQuestionFromDraft: builder.mutation<void, { draftId: string; questionId: string }>({
      query: ({ draftId, questionId }) => ({
        url: `drafts/${draftId}/remove_question/`,
        method: 'POST',
        body: { question_id: questionId },
      }),
      invalidatesTags: ['Draft'],
    }),

    // User Stats
    getUserStats: builder.query<UserStats, void>({
      query: () => 'stats/',
      providesTags: ['Question', 'Draft'],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetUserDraftsQuery,
  useGetDraftDetailQuery,
  useCreateDraftMutation,
  useUpdateDraftMutation,
  useDeleteDraftMutation,
  useAddQuestionToDraftMutation,
  useRemoveQuestionFromDraftMutation,
  useGetUserStatsQuery,
} = questionsApi;
