export type QuestionType = 'mcq' | 'cq';

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface CQSubQuestion {
  id: string;
  label: string; // e.g., 'ক', 'খ'
  text: string;
  marks: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  
  // Standard Text (used for Simple MCQ & CQ stem)
  text: string;
  
  // Combined MCQ Specifics (Optional - if present, overrides 'text' for display)
  stem?: string; // The main question intro
  romanStatements?: string[]; // Array of 3 statements [i, ii, iii]
  footer?: string; // The prompt "Which is correct?"
  
  marks: number;
  
  // MCQ Specifics
  options?: MCQOption[];
  
  // CQ Specifics
  subQuestions?: CQSubQuestion[];
  
  topic?: string;
  board?: string;
  year?: string;
}