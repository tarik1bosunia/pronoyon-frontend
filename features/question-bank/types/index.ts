export type ViewMode = 'setup' | 'browse' | 'editor';

export interface QuestionBankState {
  viewMode: ViewMode;
  selectedIds: string[];
  isSidebarOpen: boolean;
}

export interface FilterState {
  types: string[];
  boards: string[];
  years: string[];
  schools: string[];
  schoolYears: string[];
  subjects: string[];
  chapters: string[];
  topics: string[];
  specialFilters: string[];
}
