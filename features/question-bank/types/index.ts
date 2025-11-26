export type ViewMode = 'setup' | 'browse' | 'editor';

export interface QuestionBankState {
  viewMode: ViewMode;
  selectedIds: string[];
  isSidebarOpen: boolean;
}
