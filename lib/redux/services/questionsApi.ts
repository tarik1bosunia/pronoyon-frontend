import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Question {
  id: string;
  type: 'mcq' | 'cq';
  mcq_subtype?: 'simple' | 'combined';
  question_text: string;
  question_text_html: string;
  marks: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: {
    id: string;
    name: string;
    class_level: {
      id: string;
      name: string;
    };
    group?: {
      id: string;
      name: string;
      group_type: string;
    };
  };
  topics: Array<{
    id: string;
    name: string;
    chapter: {
      id: string;
      name: string;
    };
  }>;
  tags: string[];
  solution: string;
  solution_html: string;
  hints: string[];
  is_public: boolean;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  mcq_options?: Array<{
    id: string;
    option_text: string;
    option_label: string;
    is_correct: boolean;
    order: number;
    combined_option_indices?: number[];
  }>;
  cq_sub_questions?: Array<{
    id: string;
    label: string;
    sub_question_text: string;
    marks: string;
    answer: string;
    order: number;
  }>;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  has_groups: boolean;
  order: number;
}

export interface Group {
  id: string;
  name: string;
  code: string;
  group_type: string;
  class_level: {
    id: string;
    name: string;
  };
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  class_level: {
    id: string;
    name: string;
  };
  group?: {
    id: string;
    name: string;
  };
}

export interface Chapter {
  id: string;
  name: string;
  subject: {
    id: string;
    name: string;
  };
}

export interface Topic {
  id: string;
  name: string;
  chapter: {
    id: string;
    name: string;
  };
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
  tagTypes: ['Question', 'Class', 'Subject', 'Chapter', 'Topic', 'Group', 'Draft'],
  endpoints: (builder) => ({
    // Questions
    getQuestions: builder.query<QuestionsListResponse, {
      page?: number;
      page_size?: number;
      type?: string;
      difficulty?: string;
      subject_id?: string;
      class_id?: string;
      group_id?: string;
      topic_id?: string;
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
    
    getQuestionById: builder.query<Question, string>({
      query: (id) => `questions/${id}/`,
      providesTags: ['Question'],
    }),

    // Classes
    getClasses: builder.query<Class[], void>({
      query: () => 'classes/',
      providesTags: ['Class'],
    }),

    // Groups
    getGroups: builder.query<Group[], { class_id?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.class_id) {
          searchParams.append('class_level', params.class_id);
        }
        return `groups/?${searchParams.toString()}`;
      },
      providesTags: ['Group'],
    }),

    // Subjects
    getSubjects: builder.query<Subject[], { class_id?: string; group_id?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.class_id) {
          searchParams.append('class_level', params.class_id);
        }
        if (params.group_id) {
          searchParams.append('group', params.group_id);
        }
        return `subjects/?${searchParams.toString()}`;
      },
      providesTags: ['Subject'],
    }),

    // Chapters
    getChapters: builder.query<Chapter[], { subject_id?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.subject_id) {
          searchParams.append('subject', params.subject_id);
        }
        return `chapters/?${searchParams.toString()}`;
      },
      providesTags: ['Chapter'],
    }),

    // Topics
    getTopics: builder.query<Topic[], { chapter_id?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.chapter_id) {
          searchParams.append('chapter', params.chapter_id);
        }
        return `topics/?${searchParams.toString()}`;
      },
      providesTags: ['Topic'],
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
  useGetQuestionByIdQuery,
  useGetClassesQuery,
  useGetGroupsQuery,
  useGetSubjectsQuery,
  useGetChaptersQuery,
  useGetTopicsQuery,
  useGetUserDraftsQuery,
  useGetDraftDetailQuery,
  useCreateDraftMutation,
  useUpdateDraftMutation,
  useDeleteDraftMutation,
  useAddQuestionToDraftMutation,
  useRemoveQuestionFromDraftMutation,
  useGetUserStatsQuery,
} = questionsApi;
