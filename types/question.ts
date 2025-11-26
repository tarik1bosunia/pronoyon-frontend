export type QuestionType = 'mcq' | 'cq' | 'writing'; // Added 'writing'

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface CQSubQuestion {
  id: string;
  label: string; // e.g., 'a', 'b', or '1', '2'
  text: string;
  marks: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  
  // Standard Text (used for Simple MCQ & CQ stem)
  text: string;
  
  // Combined MCQ Specifics
  stem?: string; 
  romanStatements?: string[]; 
  footer?: string; 
  
  marks: number;
  
  // MCQ Specifics
  options?: MCQOption[];
  
  // CQ & Writing Specifics
  subQuestions?: CQSubQuestion[];
  
  topic?: string;
  board?: string;
  year?: string;
}