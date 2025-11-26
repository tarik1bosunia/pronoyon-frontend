import React, { useEffect, useRef, useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { MarkdownRenderer } from '@/components/editor/MarkdownRenderer';
import { cn } from '@/lib/utils';

interface InlineEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  density?: 'default' | 'compact';
}

export const InlineEditor = ({ 
  content, 
  onChange, 
  placeholder = 'Click to edit...',
  className = '',
  density = 'default'
}: InlineEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag events when clicking to edit
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  // Close edit mode only when clicking outside the editor container
  useEffect(() => {
    if (!isEditing) return;
    const handlePointerDown = (e: PointerEvent) => {
      const targetNode = e.target as Node;
      const targetEl = e.target as Element;
      // Ignore clicks inside the equation editor panel (portal)
      if (targetEl && targetEl.closest && targetEl.closest('[data-equation-editor]')) {
        return;
      }
      if (containerRef.current && !containerRef.current.contains(targetNode)) {
        setIsEditing(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [isEditing]);

  if (isEditing) {
    return (
      <div
        ref={containerRef}
        className={cn(
          'relative z-20',
          density === 'compact' && 'inline-editor--compact'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <RichTextEditor
          content={content}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            className,
            density === 'compact' && 'inline-editor--compact'
          )}
        />
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "cursor-pointer min-h-[24px] rounded hover:bg-gray-100/80 hover:ring-1 hover:ring-gray-200 transition-all px-1 -ml-1",
        !content && "text-muted-foreground italic",
        density === 'compact' && 'inline-editor--compact',
        className
      )}
    >
      {content ? (
        <MarkdownRenderer content={content} compact={density === 'compact'} />
      ) : (
        <span className="opacity-50">{placeholder}</span>
      )}
    </div>
  );
};