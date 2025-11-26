# Question Bank Feature Module

## Overview
This feature module contains all components, types, and logic for the Question Bank functionality. It's organized for easy integration with Redux Toolkit and RTK Query.

## Directory Structure

```
features/question-bank/
├── components/           # React components
│   ├── DashboardSidebar.tsx
│   ├── DashboardHeader.tsx
│   ├── NavItem.tsx
│   ├── QuestionListItem.tsx
│   ├── QuestionBrowseView.tsx
│   ├── FilterSidebar.tsx
│   ├── MultiSelectModal.tsx
│   ├── SetupView.tsx
│   └── index.ts
├── constants/           # Constants and static data
│   └── index.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── data/               # Mock data (to be replaced with API calls)
│   └── mockQuestions.ts
└── index.ts            # Feature barrel export
```

## Components

### Layout Components
- **DashboardSidebar** - Main navigation sidebar with collapsible functionality
- **DashboardHeader** - Top header with search and user actions
- **NavItem** - Reusable navigation item component

### Feature Components
- **SetupView** - Initial setup screen for creating question papers
- **QuestionBrowseView** - Main view for browsing and selecting questions
- **QuestionListItem** - Individual question card with selection functionality
- **FilterSidebar** - Right sidebar for filtering questions
- **MultiSelectModal** - Reusable modal for multi-select dropdowns

## Future Integration with Redux & RTK Query

### 1. Create API Slice
```typescript
// features/question-bank/api/questionBankApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const questionBankApi = createApi({
  reducerPath: 'questionBankApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/' }),
  endpoints: (builder) => ({
    getQuestions: builder.query({
      query: (filters) => ({
        url: 'questions/',
        params: filters,
      }),
    }),
    createQuestionPaper: builder.mutation({
      query: (data) => ({
        url: 'papers/',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetQuestionsQuery, useCreateQuestionPaperMutation } = questionBankApi;
```

### 2. Create State Slice
```typescript
// features/question-bank/slices/questionBankSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QuestionBankState {
  viewMode: 'setup' | 'browse' | 'editor';
  selectedIds: string[];
  filters: {
    board?: string[];
    year?: string[];
    subject?: string[];
  };
}

const initialState: QuestionBankState = {
  viewMode: 'setup',
  selectedIds: [],
  filters: {},
};

export const questionBankSlice = createSlice({
  name: 'questionBank',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<'setup' | 'browse' | 'editor'>) => {
      state.viewMode = action.payload;
    },
    toggleQuestionSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter(qId => qId !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    },
    setFilters: (state, action: PayloadAction<typeof initialState.filters>) => {
      state.filters = action.payload;
    },
  },
});

export const { setViewMode, toggleQuestionSelection, clearSelection, setFilters } = questionBankSlice.actions;
export default questionBankSlice.reducer;
```

### 3. Update Components to Use Redux

Example for `QuestionBrowseView`:
```typescript
import { useSelector, useDispatch } from 'react-redux';
import { useGetQuestionsQuery } from '../api/questionBankApi';
import { toggleQuestionSelection } from '../slices/questionBankSlice';

export function QuestionBrowseView() {
  const dispatch = useDispatch();
  const selectedIds = useSelector((state) => state.questionBank.selectedIds);
  const filters = useSelector((state) => state.questionBank.filters);
  
  const { data: questions, isLoading } = useGetQuestionsQuery(filters);
  
  const handleToggle = (id: string) => {
    dispatch(toggleQuestionSelection(id));
  };
  
  // ... rest of component
}
```

## Constants

All static data is centralized in `constants/index.ts`:
- `SUBJECTS_LIST` - Available subjects
- `CHAPTERS_LIST` - Available chapters
- `BOARDS_LIST` - Education boards

## Types

Centralized type definitions in `types/index.ts`:
- `ViewMode` - Application view states
- `QuestionBankState` - State shape for Redux

## Migration Steps

1. ✅ **Phase 1: Component Separation** (Complete)
   - All components extracted to feature module
   - Clean imports from single entry point

2. **Phase 2: API Integration** (Next)
   - Create RTK Query API slice
   - Replace mock data with API calls
   - Add loading states and error handling

3. **Phase 3: State Management** (Future)
   - Create Redux slice for local state
   - Move state from components to Redux store
   - Add selectors for derived data

4. **Phase 4: Advanced Features** (Future)
   - Add pagination
   - Implement search functionality
   - Add question caching
   - Implement optimistic updates

## Usage

In your page component:
```typescript
import { 
  DashboardSidebar, 
  SetupView, 
  QuestionBrowseView,
  mockQuestions 
} from '@/features/question-bank';
```

All components are ready to be connected to your Django backend using Redux Toolkit and RTK Query when you're ready to implement the API layer.
