import React, { useEffect, useRef, useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { MarkdownRenderer } from './MarkdownRenderer';

interface InlineEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export const InlineEditor = ({ 
  content, 
  onChange, 
  placeholder = 'Click to edit...',
  className = ''
}: InlineEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
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
      <div ref={containerRef}>
        <RichTextEditor
          content={content}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
        />
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer min-h-[60px] p-4 rounded-lg border border-input bg-background hover:bg-accent/5 transition-colors ${className}`}
    >
      {content ? (
        <MarkdownRenderer content={content} />
      ) : (
        <p className="text-muted-foreground">{placeholder}</p>
      )}
    </div>
  );
};
