import { useEffect, RefObject } from 'react';
import { PAGE_HEIGHT_PX, PAGE_PADDING_PX } from '../types';
import { Question } from '@/types/question';

export const usePageBreaks = (
  pageContainerRef: RefObject<HTMLDivElement | null>,
  questions: Question[],
  paperTitle: string,
  examDuration: string,
  optionGap: number,
  optionBlockGap: number,
  optionPadding: number,
  setPageBreaks: React.Dispatch<React.SetStateAction<number[]>>
) => {
  useEffect(() => {
    const computePageBreaks = () => {
      if (!pageContainerRef.current) return;

      const container = pageContainerRef.current;
      const headerEl = container.querySelector('[data-paper-header]') as HTMLElement | null;
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;
      const questionEls = Array.from(
        container.querySelectorAll<HTMLElement>('[data-question-index]')
      );

      if (!questionEls.length) {
        setPageBreaks((prev: number[]) => (prev.length ? [] : prev));
        return;
      }

      const usableHeight = PAGE_HEIGHT_PX - PAGE_PADDING_PX * 2;
      let currentHeight = headerHeight;
      const breaks: number[] = [];

      questionEls.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        const marginTop = parseFloat(styles.marginTop || '0');
        const marginBottom = parseFloat(styles.marginBottom || '0');
        const totalHeight = rect.height + marginTop + marginBottom;

        if (idx === 0) {
          if (currentHeight + totalHeight > usableHeight) {
            breaks.push(idx);
            currentHeight = totalHeight;
          } else {
            currentHeight += totalHeight;
          }
          return;
        }

        if (totalHeight > usableHeight) {
          breaks.push(idx);
          currentHeight = totalHeight;
          return;
        }

        if (currentHeight + totalHeight > usableHeight) {
          breaks.push(idx);
          currentHeight = totalHeight;
        } else {
          currentHeight += totalHeight;
        }
      });

      const normalized = Array.from(new Set(breaks))
        .filter((idx) => idx > 0 && idx < questionEls.length)
        .sort((a, b) => a - b);

      setPageBreaks((prev: number[]) => {
        if (prev.length === normalized.length && prev.every((val: number, i: number) => val === normalized[i])) {
          return prev;
        }
        return normalized;
      });
    };

    const frame = requestAnimationFrame(computePageBreaks);
    const handleResize = () => requestAnimationFrame(computePageBreaks);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, [questions, paperTitle, examDuration, optionGap, optionBlockGap, optionPadding, pageContainerRef, setPageBreaks]);
};
