# Component Hierarchy

## Visual Structure

```
PaperEditor (Main Container)
│
├─── EditorToolbar (Top Bar)
│    ├── Back Button
│    ├── Mobile Menu Button
│    ├── Title & Stats
│    ├── Set Selector
│    └── Action Buttons (Print, Save)
│
├─── EditorSidebar (Left Panel - Desktop)
│    ├── Sidebar Top (prop)
│    ├── Question Outline
│    │   └── Question List Items
│    └── Quick Add Buttons
│         ├── Add MCQ
│         ├── Add Combined MCQ
│         ├── Add Creative
│         └── Add Writing
│
├─── Main Content Area (Center)
│    └── DragDropContext
│         └── Droppable
│              └── PaperPages
│                   └── For each page:
│                        ├── PaperHeader (first page only)
│                        │    ├── Paper Title (editable)
│                        │    ├── Exam Duration (editable)
│                        │    └── Set Label
│                        │
│                        └── Questions Container
│                             └── QuestionRenderer (for each question)
│                                  ├── Drag Handle
│                                  ├── Action Buttons (Settings, Delete)
│                                  ├── Question Number
│                                  ├── Question Content
│                                  │    ├── Stem/Uddipok (optional)
│                                  │    ├── Question Text OR
│                                  │    │   CombinedQuestionEditor
│                                  │    │   ├── Stem (optional)
│                                  │    │   ├── Roman Statements (i, ii, iii)
│                                  │    │   └── Footer
│                                  │    │
│                                  │    ├── MCQ Options (if MCQ)
│                                  │    │   └── Option Items with labels
│                                  │    │
│                                  │    └── Sub-Questions (if CQ/Writing)
│                                  │        └── Sub-question Items
│                                  │
│                                  └── Solution Section
│                                       ├── Solution Paragraphs
│                                       └── Add Paragraph Button
│
├─── FloatingActionBar (Bottom Bar)
│    ├── Set Selector
│    ├── New Set Button
│    ├── Shuffle Set Button
│    └── Quick Add Buttons
│         ├── MCQ, MCQ 5
│         ├── CQ, CQ 4, CQ N
│         ├── MCQ N
│         ├── Written
│         └── Add from DB
│
├─── Sheet (Side Panel for Editing)
│    ├── SheetHeader
│    │    └── Title (Settings & Preview)
│    └── SheetContent
│         └── UnifiedQuestionForm
│              └── Question editor with all fields
│
├─── PrintPreviewModal
│    └── Modal with print-ready view
│
├─── AddFromDBModal
│    └── Modal to select questions from database
│
└─── MobileSidebar (Mobile Only)
     ├── Backdrop (overlay)
     └── Drawer
          ├── Header with close button
          └── Content
               └── EditorSidebar content
```

## Data Flow

```
┌─────────────────────────────────────────────────────┐
│              usePaperEditor Hook                    │
│  (Central State Management)                         │
│                                                      │
│  State:                                              │
│  • questions, activeSet, availableSets              │
│  • editingId, modals (open/close)                   │
│  • paperTitle, examDuration                         │
│  • showStem/Solution per question                   │
│                                                      │
│  Actions:                                            │
│  • updateQuestion, deleteQuestion                   │
│  • updateOptions, updateSubQuestions                │
│  • createSet, shuffleSet, changeSet                 │
│  • handleDragEnd                                     │
└─────────────────────────────────────────────────────┘
                         │
                         ↓
        ┌────────────────┴────────────────┐
        │                                  │
        ↓                                  ↓
┌───────────────┐                ┌────────────────┐
│  Components   │                │  usePageBreaks │
│               │                │      Hook      │
│  Receive:     │                │                │
│  • state      │                │  Calculates:   │
│  • handlers   │                │  • page breaks │
│               │                │  • boundaries  │
│  Render UI    │                └────────────────┘
└───────────────┘

```

## State Management Flow

```
User Action
    ↓
Component Event Handler
    ↓
usePaperEditor Handler
    ↓
State Update (React setState)
    ↓
Re-render Affected Components
    ↓
usePageBreaks Effect (if layout changed)
    ↓
Recalculate Page Breaks
    ↓
Update pageBreaks State
    ↓
Re-render Pages
```

## Component Interaction Example

### Adding a New Question

```
User clicks "Add MCQ" in FloatingActionBar
    ↓
FloatingActionBar.onQuickAddQuestion('mcq')
    ↓
usePaperEditor.handleQuickAddQuestion
    ↓
1. buildQuestion('mcq') → creates new question
2. updateCurrentSet([...prev, newQuestion])
3. setEditingId(newQuestion.id)
4. setSheetOpen(true)
    ↓
Sheet opens with UnifiedQuestionForm
    ↓
User edits and saves
    ↓
UnifiedQuestionForm.onSave(question)
    ↓
usePaperEditor.handleSaveForm
    ↓
1. updateCurrentSet (replace temp question)
2. setSheetOpen(false)
    ↓
QuestionRenderer shows new question
    ↓
usePageBreaks recalculates layout
```

## Component Dependencies

```
EditorToolbar
└── depends on: Button, Select, Icons

EditorSidebar
├── depends on: Button, ScrollArea, Icons
└── uses: Question outline data

QuestionRenderer
├── depends on: Draggable, InlineEditor, Button, Input
├── uses: CombinedQuestionEditor (if combined type)
└── manages: question editing inline

CombinedQuestionEditor
├── depends on: InlineEditor, Button
└── specialized for: Roman statement questions

PaperPages
├── depends on: QuestionRenderer
└── manages: pagination logic

FloatingActionBar
└── depends on: Button, Select

MobileSidebar
└── depends on: ScrollArea, Button
```

## Hook Dependencies

```
usePaperEditor
├── uses: useState (multiple states)
├── uses: useCallback (memoized handlers)
├── uses: useMemo (computed values)
├── depends on: Question type, mockQuestions
└── provides: all state and handlers

usePageBreaks
├── uses: useEffect (calculation on mount/update)
├── depends on: DOM measurement
└── provides: page break calculation
```

## File Import Structure

```
PaperEditor-new.tsx
├── imports from @/features/paper-editor
│   ├── All components
│   ├── usePaperEditor hook
│   ├── usePageBreaks hook
│   └── Types
├── imports from @/components/editor
│   ├── UnifiedQuestionForm
│   ├── PrintPreviewModal
│   └── AddFromDBModal
└── imports from @/components/ui
    └── Sheet, Button, etc.

@/features/paper-editor/index.ts
└── barrel export (re-exports everything)
```

This modular structure ensures:
- Clear separation of concerns
- Easy to trace data flow
- Simple to add new features
- Components can be tested independently
- Performance can be optimized per component
