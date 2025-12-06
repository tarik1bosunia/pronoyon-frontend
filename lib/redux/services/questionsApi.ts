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
  tagTypes: ['Question'],
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
  }),
});

export const {
  useGetQuestionsQuery,
} = questionsApi;
