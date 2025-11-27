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
  subjects: string[];
  topics: string[];
  specialFilters: string[];
}
