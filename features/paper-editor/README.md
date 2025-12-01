# Paper Editor Feature

A modular, component-based paper editor for creating and managing question papers with multiple sets, drag-and-drop functionality, and print preview.

## Directory Structure

```
features/paper-editor/
├── components/           # Reusable UI components
│   ├── CombinedQuestionEditor.tsx    # Editor for combined/roman statement MCQs
│   ├── EditorSidebar.tsx             # Left sidebar with question outline
│   ├── EditorToolbar.tsx             # Top toolbar with navigation & actions
│   ├── FloatingActionBar.tsx         # Bottom floating action bar
│   ├── MobileSidebar.tsx             # Mobile responsive sidebar
│   ├── PaperHeader.tsx               # Paper title and exam info header
│   ├── PaperPages.tsx                # Paginated paper layout renderer
│   └── QuestionRenderer.tsx          # Individual question renderer with drag-drop
├── hooks/                # Custom React hooks
│   ├── usePaperEditor.ts             # Main editor state & logic hook
│   └── usePageBreaks.ts              # Page break calculation hook
├── types/                # TypeScript type definitions
│   └── index.ts                      # Shared types and constants
├── utils/                # Utility functions
│   └── questionHelpers.ts            # Question manipulation utilities
└── index.ts              # Public API exports
```

## Components

### `CombinedQuestionEditor`
Specialized editor for combined MCQ questions with Roman numeral statements (i, ii, iii).

**Props:**
- `question` - The question object
- `onUpdate` - Callback for question updates
- `showStem` - Whether to show the stem/uddipok
- `onToggleStem` - Toggle stem visibility

### `EditorToolbar`
Top navigation bar with back button, question stats, set selector, and action buttons.

**Props:**
- `onBack` - Navigate back callback
- `questions` - Array of questions
- `activeSet` - Currently active question set
- `availableSets` - Array of available sets
- `onSetChange` - Set change handler
- `onPrintClick` - Print handler

### `EditorSidebar`
Left sidebar showing question outline and quick add buttons.

**Props:**
- `questions` - Array of questions
- `onAddNew` - Add new question handler
- `onQuestionClick` - Question navigation handler

### `FloatingActionBar`
Bottom action bar for quick question addition and set management.

**Props:**
- `activeSet` - Current set
- `availableSets` - Available sets
- `onCreateSet` - Create new set
- `onShuffleAndCreateSet` - Shuffle and create
- `onQuickAddQuestion` - Quick add handler

### `QuestionRenderer`
Renders individual questions with inline editing, drag-drop, and solution sections.

**Props:**
- `question` - Question to render
- `questionIndex` - Index in list
- `optionGap`, `optionBlockGap`, `optionPadding` - Spacing options
- `onUpdate`, `onDelete`, `onSettings` - Action handlers

### `PaperHeader`
Paper title, exam duration, and set label header.

**Props:**
- `paperTitle` - Paper title
- `examDuration` - Exam duration
- `activeSetLabel` - Current set label
- `onTitleChange`, `onDurationChange` - Change handlers

### `PaperPages`
Manages paginated layout and renders questions across multiple pages.

**Props:**
- `pageBoundaries` - Array of page boundaries
- `questions` - Questions to render
- `pageHeader` - Header component
- All question renderer props

### `MobileSidebar`
Responsive sidebar drawer for mobile devices.

**Props:**
- `isOpen` - Open state
- `onClose` - Close handler
- `sidebarContent` - Content to display

## Hooks

### `usePaperEditor(initialQuestions)`
Main hook managing all editor state and actions.

**Returns:**
- `questions` - Current questions array
- `activeSet`, `availableSets` - Set management
- `updateQuestion`, `deleteQuestion` - Question operations
- `handleAddNew`, `handleSaveForm` - Form handlers
- Many more state values and handlers

### `usePageBreaks(...)`
Calculates page breaks based on question heights and page dimensions.

**Parameters:**
- `pageContainerRef` - Ref to page container
- `questions` - Questions array
- Layout configuration (title, duration, spacing)
- `setPageBreaks` - State setter

## Types

### `PaperEditorProps`
Main editor component props interface.

### `QuestionSetOption`
Question set definition (e.g., Set A, Set B).

### Constants
- `QUESTION_SET_OPTIONS` - Available sets
- `MCQ_OPTION_LABELS` - Bengali option labels
- `PAGE_HEIGHT_PX`, `PAGE_PADDING_PX` - Page dimensions

## Utilities

### `cloneQuestions(questions)`
Deep clones questions array preserving all nested properties.

### `getNewQuestionDefaults(type)`
Returns default question object for given type (mcq, cq, combined, writing).

### `buildQuestion(type, optionsPerQuestion)`
Builds a new question with specified number of options.

## Usage

```tsx
import { PaperEditor } from '@/components/editor/PaperEditor-new';
import { mockQuestions } from '@/features/question-bank/data/mockQuestions';

function MyApp() {
  return (
    <PaperEditor
      initialQuestions={mockQuestions}
      onBack={() => console.log('back')}
    />
  );
}
```

## Benefits of This Structure

1. **Modularity** - Each component has a single responsibility
2. **Reusability** - Components can be used independently
3. **Maintainability** - Easier to locate and fix issues
4. **Testability** - Smaller components are easier to test
5. **Performance** - Easier to optimize specific components
6. **Scalability** - Adding features doesn't bloat a single file
7. **Type Safety** - Centralized types ensure consistency
8. **Developer Experience** - Clear separation of concerns

## Migration Path

The old `PaperEditor.tsx` remains intact. The new modular version is in `PaperEditor-new.tsx`.

To migrate:
1. Test `PaperEditor-new.tsx` thoroughly
2. Update imports from `PaperEditor` to `PaperEditor-new`
3. Once stable, rename or remove the old file
