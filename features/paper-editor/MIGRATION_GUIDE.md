# Migration Guide: Old PaperEditor → New Modular PaperEditor

## Quick Start

### Step 1: Test the New Version

Simply update your import to test the new modular version:

```tsx
// Before
import { PaperEditor } from '@/components/editor/PaperEditor';

// After (for testing)
import { PaperEditor } from '@/components/editor/PaperEditor-new';

// Component usage remains exactly the same!
<PaperEditor
  initialQuestions={mockQuestions}
  onBack={() => handleBack()}
  sidebarTop={<YourSidebarContent />}
/>
```

**No other changes needed!** The API is 100% compatible.

### Step 2: Verify Everything Works

Test all features:
- [ ] Add questions (MCQ, CQ, Combined, Writing)
- [ ] Edit questions inline
- [ ] Drag and drop questions
- [ ] Create new sets
- [ ] Shuffle sets
- [ ] Switch between sets
- [ ] Add from database
- [ ] Print preview
- [ ] Mobile sidebar
- [ ] Question settings panel
- [ ] Solutions section

### Step 3: Make It Permanent

Once you've verified everything works:

```bash
# Backup the old version (optional)
mv components/editor/PaperEditor.tsx components/editor/PaperEditor-old-backup.tsx

# Rename the new version
mv components/editor/PaperEditor-new.tsx components/editor/PaperEditor.tsx

# Update imports back to original
# No code changes needed - just the filename changed!
```

## What Changed? (For Developers)

### Code Organization

**Before:**
- 1 massive file (1262 lines)
- Everything in one place
- Hard to maintain

**After:**
```
features/paper-editor/
├── components/ (8 files)
├── hooks/ (2 files)
├── types/ (1 file)
├── utils/ (1 file)
```

### Key Improvements

1. **Separation of Concerns**
   - UI components in `components/`
   - Business logic in `hooks/`
   - Types in `types/`
   - Utilities in `utils/`

2. **Maintainability**
   - Each component ~50-350 lines
   - Easy to locate specific functionality
   - Changes isolated to specific files

3. **Testability**
   - Components can be tested individually
   - Hooks can be tested with `@testing-library/react-hooks`
   - Pure utility functions easy to unit test

4. **Performance Potential**
   - Easier to add React.memo to specific components
   - Can optimize render cycles per component
   - Better code splitting opportunities

## Using Individual Components

The modular structure allows you to reuse components:

```tsx
import { 
  EditorToolbar, 
  EditorSidebar,
  QuestionRenderer 
} from '@/features/paper-editor';

// Use components independently in other contexts
function CustomEditor() {
  return (
    <>
      <EditorToolbar {...toolbarProps} />
      <QuestionRenderer {...questionProps} />
    </>
  );
}
```

## Using Hooks Independently

```tsx
import { usePaperEditor, usePageBreaks } from '@/features/paper-editor';

function MyCustomEditor() {
  const {
    questions,
    updateQuestion,
    handleAddNew
  } = usePaperEditor(initialQuestions);
  
  // Use the state and handlers as needed
}
```

## Customizing Components

Since components are now separate, you can:

1. **Extend a component**
```tsx
import { EditorToolbar } from '@/features/paper-editor';

function CustomToolbar(props) {
  return (
    <div>
      <EditorToolbar {...props} />
      <div>My custom additions</div>
    </div>
  );
}
```

2. **Replace a component**
```tsx
// Instead of EditorSidebar, use your own
import { EditorToolbar, FloatingActionBar } from '@/features/paper-editor';
import MyCustomSidebar from './MyCustomSidebar';

function CustomPaperEditor() {
  return (
    <div>
      <EditorToolbar {...} />
      <MyCustomSidebar {...} />  {/* Your version */}
      <FloatingActionBar {...} />
    </div>
  );
}
```

## Troubleshooting

### Import errors?

Make sure the barrel export is working:
```tsx
// This should work
import { EditorToolbar } from '@/features/paper-editor';

// If not, try direct import
import { EditorToolbar } from '@/features/paper-editor/components/EditorToolbar';
```

### Type errors?

All types are exported from the main index:
```tsx
import { 
  PaperEditorProps, 
  QuestionSetOption,
  MCQ_OPTION_LABELS 
} from '@/features/paper-editor';
```

### Component not rendering?

Check that you're passing all required props. The component will show TypeScript errors if props are missing.

## Rollback Plan

If you encounter issues:

1. **Immediate rollback**
```bash
# Just switch back to the old file
mv components/editor/PaperEditor.tsx components/editor/PaperEditor-new.tsx
mv components/editor/PaperEditor-old-backup.tsx components/editor/PaperEditor.tsx
```

2. **Keep both versions**
```tsx
// Import the old version
import { PaperEditor as OldEditor } from '@/components/editor/PaperEditor-old-backup';

// Use based on feature flag
const Editor = useFeatureFlag('new-editor') ? PaperEditor : OldEditor;
```

## Performance Comparison

Run these checks before and after migration:

```tsx
// Add React DevTools Profiler
import { Profiler } from 'react';

<Profiler id="PaperEditor" onRender={(id, phase, actualDuration) => {
  console.log(`${id} took ${actualDuration}ms`);
}}>
  <PaperEditor {...props} />
</Profiler>
```

Measure:
- Initial render time
- Re-render time when editing
- Drag-and-drop performance
- Set switching time

## Next Steps After Migration

1. **Add Tests**
   - Unit tests for utility functions
   - Component tests with React Testing Library
   - Integration tests for complex flows

2. **Optimize Performance**
   - Add React.memo to expensive components
   - Use useMemo for heavy calculations
   - Implement virtual scrolling for long question lists

3. **Improve Type Safety**
   - Add stricter TypeScript settings
   - Use discriminated unions for question types
   - Add runtime type validation with Zod

4. **Add Documentation**
   - JSDoc comments for all props
   - Storybook stories for components
   - Usage examples in docs

## Support

If you encounter issues:
1. Check the README.md in `features/paper-editor/`
2. Review ARCHITECTURE.md for component relationships
3. Check TypeScript errors carefully
4. Test with the old version to confirm behavior

## Checklist

Before going to production:

- [ ] All features tested
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Mobile responsive works
- [ ] Print preview works
- [ ] Data persists correctly
- [ ] Drag-and-drop smooth
- [ ] All question types working
- [ ] Set management working
- [ ] Solution editor working
- [ ] Database integration working

## Success Metrics

The migration is successful when:
- ✅ All tests pass
- ✅ No regression in functionality
- ✅ Code is more maintainable
- ✅ Performance is same or better
- ✅ Team can work more efficiently
- ✅ New features easier to add

Happy migrating! 🚀
