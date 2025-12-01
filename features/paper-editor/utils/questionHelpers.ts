import { Question } from '@/types/question';
import { v4 as uuidv4 } from 'uuid';

export const cloneQuestions = (items: Question[]): Question[] =>
  items.map((question) => ({
    ...question,
    options: question.options?.map((opt) => ({ ...opt })),
    subQuestions: question.subQuestions?.map((sq) => ({ ...sq })),
    romanStatements: question.romanStatements ? [...question.romanStatements] : undefined
  }));

export const getNewQuestionDefaults = (typeStr: string): Question => {
  const type = typeStr.replace('new-', '') as 'mcq' | 'cq' | 'combined' | 'writing';
  
  if (type === 'cq') {
    return {
      id: 'temp',
      type: 'cq',
      text: '',
      marks: 10,
      subQuestions: [
        { id: uuidv4(), label: 'ক', text: '', marks: 1 },
        { id: uuidv4(), label: 'খ', text: '', marks: 2 },
        { id: uuidv4(), label: 'গ', text: '', marks: 3 },
        { id: uuidv4(), label: 'ঘ', text: '', marks: 4 },
      ]
    } as Question;
  }

  if (type === 'writing') {
    return {
      id: 'temp',
      type: 'writing',
      text: '', // Main stem
      marks: 5,
      subQuestions: [
        { id: uuidv4(), label: '1', text: '', marks: 5 }, // Starts with 1 sub-question
      ]
    } as Question;
  }

  if (type === 'combined') {
    return {
      id: 'temp',
      type: 'mcq',
      text: '', 
      stem: '',
      romanStatements: ['', '', ''],
      footer: 'নিচের কোনটি সঠিক?',
      marks: 1,
      options: [
        { id: uuidv4(), text: 'i ও ii', isCorrect: false },
        { id: uuidv4(), text: 'i ও iii', isCorrect: false },
        { id: uuidv4(), text: 'ii ও iii', isCorrect: false },
        { id: uuidv4(), text: 'i, ii ও iii', isCorrect: false },
      ]
    } as Question;
  }

  // Standard MCQ
  return {
    id: 'temp',
    type: 'mcq',
    text: '',
    stem: '',
    marks: 1,
    options: [
      { id: uuidv4(), text: '', isCorrect: false },
      { id: uuidv4(), text: '', isCorrect: false },
      { id: uuidv4(), text: '', isCorrect: false },
      { id: uuidv4(), text: '', isCorrect: false },
    ]
  } as Question;
};

export const buildQuestion = (
  type: 'mcq' | 'cq' | 'combined' | 'writing',
  optionsPerQuestion?: number
): Question => {
  const template = getNewQuestionDefaults(`new-${type}`);

  if (
    type === 'mcq' &&
    template.options &&
    typeof optionsPerQuestion === 'number' &&
    optionsPerQuestion > template.options.length
  ) {
    const additions = Array.from({ length: optionsPerQuestion - template.options.length }, () => ({
      id: uuidv4(),
      text: '',
      isCorrect: false
    }));
    template.options = [...template.options, ...additions];
  }

  return {
    ...template,
    id: uuidv4()
  };
};
