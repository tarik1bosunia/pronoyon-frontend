import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Mathematics } from '@tiptap/extension-mathematics';
import { 
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, 
  Code, Image as ImageIcon, Table as TableIcon, Link as LinkIcon,
  List, ListOrdered, Quote, Undo, Redo, Sigma
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EquationEditor } from './EquationEditor';
import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({ 
  content, 
  onChange, 
  placeholder = 'Start typing...',
  className = ''
}: RichTextEditorProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [equationEditorOpen, setEquationEditorOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline cursor-pointer' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'max-w-full h-auto rounded-lg' },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: { class: 'border-collapse table-auto w-full my-4' },
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
      Mathematics.configure({ katexOptions: { throwOnError: false } }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[60px] p-3',
      },
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  useEffect(() => {
    if (!isMounted || !editor) return;
    if (!editor.isFocused) {
      editor.chain().focus('end').run();
    }
  }, [editor, isMounted]);

  if (!isMounted || !editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const insertEquation = (latex: string) => {
    editor.chain().focus().insertContent(`$${latex}$`).run();
  };

  return (
    // USE cn() HERE: This allows 'border-none' from the parent to actually remove the border
    <div className={cn("border border-input rounded-lg overflow-hidden bg-background shadow-sm transition-all focus-within:ring-2 ring-[#009d6e]/20", className)}>
      {/* Toolbar - Only show when focused */}
      {isFocused && (
        <div className="flex flex-wrap items-center gap-1 p-1 border-b bg-gray-50/50 animate-in slide-in-from-top-1 duration-200">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={cn("h-7 w-7 p-0", editor.isActive('bold') && 'bg-accent')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={cn("h-7 w-7 p-0", editor.isActive('italic') && 'bg-accent')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={cn("h-7 w-7 p-0", editor.isActive('underline') && 'bg-accent')}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-4 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className={cn("h-7 w-7 p-0", editor.isActive('heading', { level: 1 }) && 'bg-accent')}
          title="H1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={cn("h-7 w-7 p-0", editor.isActive('heading', { level: 2 }) && 'bg-accent')}
          title="H2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={cn("h-7 w-7 p-0", editor.isActive('bulletList') && 'bg-accent')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={cn("h-7 w-7 p-0", editor.isActive('orderedList') && 'bg-accent')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleCodeBlock().run();
          }}
          className={cn("h-7 w-7 p-0", editor.isActive('codeBlock') && 'bg-accent')}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={cn("h-7 w-7 p-0", editor.isActive('blockquote') && 'bg-accent')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            addLink();
          }}
          className={cn("h-7 w-7 p-0", editor.isActive('link') && 'bg-accent')}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            addImage();
          }}
          className="h-7 w-7 p-0"
          title="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
          }}
          className="h-7 w-7 p-0"
          title="Table"
        >
          <TableIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            setEquationEditorOpen(true);
          }}
          className="h-7 w-7 p-0 hover:text-blue-600 hover:bg-blue-50"
          title="Equation Editor"
        >
          <Sigma className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          disabled={!editor.can().undo()}
          className="h-7 w-7 p-0"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          disabled={!editor.can().redo()}
          className="h-7 w-7 p-0"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Equation Editor Sheet */}
      <EquationEditor
        open={equationEditorOpen}
        onOpenChange={setEquationEditorOpen}
        onInsert={insertEquation}
      />
    </div>
  );
};