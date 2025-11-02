export type QuestionType = 'mcq' | 'cq';

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface CQSubQuestion {
  id: string;
  text: string;
  marks: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  marks: number;
  
  // For MCQ
  options?: MCQOption[];
  
  // For CQ
  subQuestions?: CQSubQuestion[];
  
  createdAt: Date;
}
