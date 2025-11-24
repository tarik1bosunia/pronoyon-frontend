import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Sigma } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ content, onChange, placeholder, className }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder || 'Start typing...' }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none min-h-[100px] p-3",
          className
        ),
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-md overflow-hidden bg-white focus-within:ring-2 ring-[#009d6e]/20 transition-all">
      <div className="flex items-center gap-1 border-b bg-gray-50/50 p-1">
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive('bold')}
          icon={<Bold className="w-4 h-4"/>}
        />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive('italic')}
          icon={<Italic className="w-4 h-4"/>}
        />
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          isActive={editor.isActive('bulletList')}
          icon={<List className="w-4 h-4"/>}
        />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          isActive={editor.isActive('orderedList')}
          icon={<ListOrdered className="w-4 h-4"/>}
        />
        <div className="flex-1" />
        <MenuButton 
            onClick={() => {
                // Insert a placeholder for Math (You can connect EquationEditor here)
                editor.chain().focus().insertContent(' $x$ ').run();
            }}
            isActive={false}
            icon={<Sigma className="w-4 h-4"/>}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

const MenuButton = ({ onClick, isActive, icon }: any) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    className={cn("h-8 w-8 p-0", isActive && "bg-gray-200 text-black")}
    type="button"
  >
    {icon}
  </Button>
);