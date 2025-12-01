# RBAC Frontend Implementation Guide

## Overview

This RBAC (Role-Based Access Control) system provides comprehensive protection for your Next.js application with role and permission-based guards.

## Features

✅ **Multi-level Protection**

- Route-level (Next.js middleware)
- Component-level (Guard components)
- Hook-based (Custom hooks)
- HOC wrappers (Higher-Order Components)

✅ **Flexible Checks**

- Role-based: `hasRole('admin')`
- Permission-based: `hasPermission('question.create')`
- Multiple: `hasAnyRole(['admin', 'manager'])`
- Combined: Both role AND permission checks

✅ **Loading & Error States**

- Loading skeletons while checking auth
- Unauthorized redirects to `/login`
- Forbidden redirects to `/403`
- Custom fallback components

## Quick Start

### 1. Protect a Page with Guard Component

```tsx
import { RBACGuard } from '@/components/rbac';

export default function AdminPage() {
  return (
    <RBACGuard role="admin">
      <div>Admin-only content</div>
    </RBACGuard>
  );
}
```

### 2. Conditional Rendering with Hooks

```tsx
'use client';
import { useRole, usePermission } from '@/lib/rbac/hooks';

export function QuestionActions() {
  const isManager = useRole('manager');
  const canCreate = usePermission('question.create');
  
  return (
    <div>
      {canCreate && <button>Create Question</button>}
      {isManager && <button>Manage Questions</button>}
    </div>
  );
}
```

### 3. Component-level Gate

```tsx
import { PermissionGate } from '@/components/rbac';

export function QuestionList() {
  return (
    <div>
      <h1>Questions</h1>
      
      <PermissionGate permission="question.create">
        <button>Add New Question</button>
      </PermissionGate>
      
      {/* Questions list */}
    </div>
  );
}
```

### 4. HOC Wrapper

```tsx
import { withRole } from '@/lib/rbac';

function ManagerDashboard() {
  return <div>Manager Dashboard</div>;
}

export default withRole(ManagerDashboard, { role: 'manager' });
```

## Components

### `<RBACGuard>`
Combined authentication, role, and permission protection.

```tsx
<RBACGuard
  role="admin"
  permission="user.create"
  loginRedirect="/login"
  forbiddenRedirect="/403"
>
  <AdminContent />
</RBACGuard>
```

### `<AuthGuard>`
Simple authentication check only.

```tsx
<AuthGuard requireAuth={true}>
  <ProtectedContent />
</AuthGuard>
```

### `<RoleGate>`
Show/hide content based on roles.

```tsx
<RoleGate role="manager" fallback={<AccessDenied />}>
  <ManagerFeatures />
</RoleGate>

<RoleGate anyRoles={['admin', 'manager']}>
  <StaffContent />
</RoleGate>
```

### `<PermissionGate>`
Show/hide content based on permissions.

```tsx
<PermissionGate permission="question.create">
  <CreateButton />
</PermissionGate>

<PermissionGate anyPermissions={['user.view', 'user.create']}>
  <UserManagement />
</PermissionGate>
```

## Hooks

### `useRBAC()`
Comprehensive RBAC hook with all checks.

```tsx
const rbac = useRBAC();

rbac.isAuthenticated // boolean
rbac.user // User object
rbac.hasRole('admin') // boolean
rbac.hasPermission('question.create') // boolean
rbac.isAdmin // boolean
rbac.primaryRole // Role object
```

### Individual Hooks

```tsx
// Auth
const { isAuthenticated, user } = useAuth();

// Roles
const isAdmin = useIsAdmin();
const isManager = useIsManager();
const hasManagerRole = useRole('manager');
const hasAnyRole = useAnyRole(['admin', 'manager']);

// Permissions
const canCreate = usePermission('question.create');
const canManage = useAnyPermission(['user.view', 'user.create']);
const canDoAll = useAllPermissions(['user.view', 'user.create', 'user.delete']);

// Role info
const primaryRole = usePrimaryRole();
const allRoles = useActiveRoles();
const roleLevel = useRoleLevel();
```

## HOCs

### `withAuth`
Require authentication.

```tsx
export default withAuth(MyComponent, {
  redirectTo: '/login',
  loadingComponent: <Spinner />,
});
```

### `withRole`
Require specific role.

```tsx
export default withRole(AdminPanel, {
  role: 'admin',
  redirectTo: '/403',
});
```

### `withPermission`
Require specific permission.

```tsx
export default withPermission(QuestionEditor, {
  permission: 'question.create',
  redirectTo: '/403',
});
```

### `withRBAC`
Combined role and permission check.

```tsx
export default withRBAC(ManagerTools, {
  role: 'manager',
  permission: 'question.manage',
  redirectTo: '/403',
});
```

## Middleware

Route-level protection in `middleware.ts`:

```typescript
// Configured routes:
// - Public: /, /login, /register
// - Admin: /admin/*
// - Manager: /questions/create, /subjects, /topics
// - User: /drafts/*, /wallet
// - Authenticated: /dashboard, /profile
```

Redirects to `/login` if not authenticated.

## Utility Functions

Direct utility functions for custom logic:

```tsx
import { 
  hasRole, 
  hasPermission, 
  isAdmin,
  getUserRoleLevel 
} from '@/lib/rbac';

if (hasRole(user, 'admin')) {
  // Admin logic
}

if (hasPermission(user, 'question.create')) {
  // Allow creation
}

const level = getUserRoleLevel(user);
```

## Role Hierarchy

From backend RBAC system:

- **Admin (Level 70)**: Full system control, user management, payment monitoring
- **Manager (Level 60)**: Question database management, CRUD operations
- **User (Level 10)**: Browse questions, create drafts, export PDFs

## Permission Categories

- `user.*` - User management
- `question.*` - Question operations
- `subject.*`, `topic.*` - Content organization
- `draft.*` - User draft management
- `payment.*`, `wallet.*` - Payment operations
- `pdf.*` - PDF export
- `system.*` - System settings

## Examples

### Protected Admin Page

```tsx
// app/admin/users/page.tsx
import { RBACGuard } from '@/components/rbac';

export default function UsersPage() {
  return (
    <RBACGuard 
      role="admin"
      permission="user.view"
    >
      <UserManagement />
    </RBACGuard>
  );
}
```

### Manager Dashboard

```tsx
// app/manager/page.tsx
'use client';
import { useIsManager, usePermission } from '@/lib/rbac/hooks';
import { RoleGate } from '@/components/rbac';

export default function ManagerPage() {
  const isManager = useIsManager();
  const canCreateQuestions = usePermission('question.create');
  
  if (!isManager) return <div>Access Denied</div>;
  
  return (
    <div>
      <h1>Manager Dashboard</h1>
      
      {canCreateQuestions && (
        <button>Create Question</button>
      )}
      
      <RoleGate role="manager">
        <QuestionsList />
      </RoleGate>
    </div>
  );
}
```

### User Draft Page

```tsx
// app/drafts/page.tsx
import { RBACGuard } from '@/components/rbac';

export default function DraftsPage() {
  return (
    <RBACGuard 
      role="user"
      permission="draft.view"
    >
      <MyDrafts />
    </RBACGuard>
  );
}
```

### Multi-Role Access

```tsx
<RoleGate anyRoles={['admin', 'manager']}>
  <StaffDashboard />
</RoleGate>

<PermissionGate anyPermissions={['question.view', 'question.create']}>
  <QuestionTools />
</PermissionGate>
```

## Best Practices

1. **Use Guards for Pages**: Wrap entire pages with `<RBACGuard>` or `<AuthGuard>`
2. **Use Gates for UI**: Use `<RoleGate>` and `<PermissionGate>` for conditional rendering
3. **Use Hooks for Logic**: Use hooks for complex conditional logic
4. **Use HOCs Sparingly**: Only use HOCs when wrapping exported components
5. **Check Both**: Always check both authentication AND authorization
6. **Handle Loading**: Provide loading states for better UX
7. **Provide Fallbacks**: Always provide fallback components for denied access

## API Integration

Update backend API endpoints to return RBAC data:

```typescript
// Backend should return:
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "roles": [{
      "role": {
        "slug": "admin",
        "level": 70,
        "permissions": [...]
      },
      "is_primary": true,
      "is_active": true
    }],
    "permissions": [
      { "name": "user.create", "is_active": true },
      { "name": "question.view", "is_active": true }
    ]
  }
}
```

## Troubleshooting

**Q: Guards not working?**

- Ensure user data includes `roles` and `permissions` arrays
- Check Redux state in dev tools
- Verify backend returns RBAC data

**Q: Middleware redirecting incorrectly?**

- Check route configuration in `middleware.ts`
- Verify access token is stored in cookies

**Q: Permission checks always failing?**

- Ensure permission names match backend exactly
- Check if permissions are marked as `is_active: true`

## TypeScript Support

Full TypeScript support with type safety:

```typescript
import type { User, Role, Permission } from '@/types/rbac';

const user: User = {...};
const hasAccess: boolean = hasRole(user, 'admin');
```

---

**Implementation Complete** ✅

All RBAC components, hooks, HOCs, and utilities are ready to use!
