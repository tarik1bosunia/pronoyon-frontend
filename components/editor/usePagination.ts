import { useEffect, useState, useRef } from 'react';
import { Question } from '@/types/question';

interface Page {
  pageNumber: number;
  questions: { question: Question; index: number }[];
}

export function usePagination(questions: Question[]) {
  const [pages, setPages] = useState<Page[]>([]);
  const questionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    // Calculate pagination based on A4 height
    const A4_HEIGHT_PX = 1122; // 297mm at 96dpi (297 * 96 / 25.4)
    const HEADER_HEIGHT_PX = 150; // Approximate header height
    const MARGIN_PX = 56; // 15mm margins top and bottom
    const USABLE_HEIGHT = A4_HEIGHT_PX - (MARGIN_PX * 2);
    
    const newPages: Page[] = [];
    let currentPage: Page = { pageNumber: 1, questions: [] };
    let currentPageHeight = HEADER_HEIGHT_PX; // Start with header on page 1

    questions.forEach((q, index) => {
      const questionEl = questionRefs.current.get(q.id);
      const questionHeight = questionEl?.offsetHeight || 150; // Default estimate

      // Check if question fits on current page
      if (currentPageHeight + questionHeight + 32 > USABLE_HEIGHT && currentPage.questions.length > 0) {
        // Start new page
        newPages.push(currentPage);
        currentPage = { 
          pageNumber: newPages.length + 1, 
          questions: [] 
        };
        currentPageHeight = 0; // No header on subsequent pages
      }

      currentPage.questions.push({ question: q, index });
      currentPageHeight += questionHeight + 32; // 32px = space-y-8
    });

    // Add last page
    if (currentPage.questions.length > 0) {
      newPages.push(currentPage);
    }

    setPages(newPages.length > 0 ? newPages : [{ pageNumber: 1, questions: [] }]);
  }, [questions]);

  const registerQuestionRef = (id: string, el: HTMLElement | null) => {
    if (el) {
      questionRefs.current.set(id, el);
    } else {
      questionRefs.current.delete(id);
    }
  };

  return { pages, registerQuestionRef };
}
