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
  text: string;
  marks: number;
  // MCQ Specifics
  options?: MCQOption[];
  // CQ Specifics
  subQuestions?: CQSubQuestion[];
  topic?: string;
  board?: string;
  year?: string;
}