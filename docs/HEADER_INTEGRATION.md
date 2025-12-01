# How to Add User Menu to Dashboard Header

## Quick Integration

Replace the existing Users button in `DashboardHeader.tsx` with the `UserMenu` component:

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu } from 'lucide-react';
import { UserMenu } from '@/components/auth';  // Add this import

interface Props {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function DashboardHeader({ isSidebarOpen, setSidebarOpen }: Props) {
  return (
    <header className="h-16 bg-white border-b px-4 sm:px-6 flex items-center justify-between">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="md:flex"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-4">
         <div className="relative hidden sm:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
           <Input className="pl-9 w-40 sm:w-64 bg-gray-50 border-gray-200" placeholder="খুঁজুন..." />
         </div>
         {/* Replace Users button with UserMenu */}
         <UserMenu />
      </div>
    </header>
  );
}
```

## What This Adds

The `UserMenu` component provides:

1. **Avatar with Initials**
   - Shows first letter of first name + last name
   - Falls back to email first letter
   - Styled with primary colors

2. **Dropdown Menu** (on click)
   - User name and email
   - Profile link (→ /user)
   - Settings link (→ /settings)
   - Logout button (with confirmation)

3. **Guest State**
   - Shows "Sign In" and "Sign Up" buttons when not authenticated
   - Automatically updates when user logs in/out

## Screenshot Preview

```
┌─────────────────────────────────────┐
│  [☰]      Search...          [JD▾] │  ← User initials in circle
└─────────────────────────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────┐
                    │ John Doe             │
                    │ john@example.com     │
                    ├──────────────────────┤
                    │ 👤 Profile           │
                    │ ⚙️  Settings          │
                    ├──────────────────────┤
                    │ 🚪 Log out           │
                    └──────────────────────┘
```

## Additional Customization

You can customize the UserMenu appearance:

```tsx
// Add custom styling
<UserMenu className="custom-class" />

// Or modify UserMenu.tsx directly to match your design
```

That's it! The authentication is fully integrated. 🎉
