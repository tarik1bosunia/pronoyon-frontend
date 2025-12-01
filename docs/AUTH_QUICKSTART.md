# Authentication UI - Quick Start

## What Was Created

### 🔐 Core Authentication
1. **Redux Store** (`lib/redux/store.ts`)
   - Configured with RTK Query
   - Auth state management

2. **Auth API** (`lib/redux/services/authApi.ts`)
   - Login, Register, Logout, Refresh Token endpoints
   - Automatic Bearer token injection

3. **Auth Slice** (`lib/redux/slices/authSlice.ts`)
   - State: user, access, refresh, isAuthenticated
   - Actions: setCredentials, updateAccessToken, logout
   - LocalStorage persistence

### 🎨 UI Components
1. **Login Page** (`/auth/login`)
   - Email/password form
   - Error handling
   - Redirect to /questions on success

2. **Register Page** (`/auth/register`)
   - Email, password, first/last name fields
   - Validation
   - Auto-login on success

3. **Protected Route** (`components/auth/ProtectedRoute.tsx`)
   - Wraps pages requiring authentication
   - Auto-redirects to login

4. **User Menu** (`components/auth/UserMenu.tsx`)
   - Avatar with user initials
   - Dropdown: Profile, Settings, Logout

### ⚙️ Configuration
- **Environment**: `.env.local` with API URL
- **Provider**: Redux wrapped in `app/layout.tsx`
- **Types**: Full TypeScript interfaces in `types/auth/`

## How to Use

### Test the Authentication Flow

1. **Start Backend**
   ```bash
   cd pronoyon-backend
   docker compose up
   ```

2. **Start Frontend**
   ```bash
   cd pronoyon-frontend
   npm run dev
   ```

3. **Test Registration**
   - Go to http://localhost:3000
   - Click "Get Started" → redirects to login
   - Click "Sign up"
   - Fill form: 
     - Email: test@example.com
     - Password: Test123!@#
     - First Name: John
     - Last Name: Doe
   - Submit → auto-login → redirects to /questions

4. **Test Login**
   - Logout from user menu
   - Go to /auth/login
   - Login with registered credentials
   - Should redirect to /questions

### Add Authentication to New Pages

```tsx
// app/my-page/page.tsx
'use client';

import { ProtectedRoute } from '@/components/auth';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>Protected Content</div>
    </ProtectedRoute>
  );
}
```

### Add User Menu to Header

```tsx
import { UserMenu } from '@/components/auth';

<header>
  <nav>
    {/* ... */}
    <UserMenu />
  </nav>
</header>
```

### Access User Data

```tsx
'use client';

import { useAppSelector } from '@/lib/redux/hooks';

export default function MyComponent() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  if (!isAuthenticated) return null;
  
  return <div>Welcome {user?.first_name}!</div>;
}
```

### Make Authenticated API Calls

The auth token is automatically included in all RTK Query requests!

```tsx
// lib/redux/services/questionsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.access;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const questionsApi = createApi({
  reducerPath: 'questionsApi',
  baseQuery,
  endpoints: (builder) => ({
    getQuestions: builder.query({
      query: () => '/questions/',
    }),
  }),
});
```

## File Structure Created

```
pronoyon-frontend/
├── .env.local                              # API configuration
├── docs/
│   └── AUTHENTICATION.md                   # Full documentation
├── app/
│   ├── layout.tsx                          # ✅ Updated with ReduxProvider
│   ├── page.tsx                            # ✅ Updated with auth redirect
│   ├── auth/
│   │   ├── login/page.tsx                  # ✅ Login page
│   │   └── register/page.tsx               # ✅ Register page
│   └── questions/page.tsx                  # ✅ Protected route
├── components/
│   └── auth/
│       ├── ProtectedRoute.tsx              # ✅ Route wrapper
│       ├── UserMenu.tsx                    # ✅ User dropdown
│       └── index.ts                        # ✅ Exports
├── lib/
│   ├── providers/
│   │   └── ReduxProvider.tsx               # ✅ Redux wrapper
│   └── redux/
│       ├── store.ts                        # ✅ Store config
│       ├── hooks.ts                        # ✅ Typed hooks
│       ├── services/
│       │   └── authApi.ts                  # ✅ API endpoints
│       └── slices/
│           └── authSlice.ts                # ✅ State management
└── types/
    └── auth/
        └── index.ts                        # ✅ TypeScript types
```

## Testing Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can see user info in dropdown
- [ ] Can logout successfully
- [ ] Protected routes redirect to login when not authenticated
- [ ] Authenticated users can access protected routes
- [ ] Tokens persist after page refresh
- [ ] User data shows in UI (first name, last name)

## Common Issues

**Issue**: "Cannot read properties of undefined (reading 'auth')"
**Fix**: Make sure `ReduxProvider` wraps your app in `layout.tsx`

**Issue**: "Network error" on API calls
**Fix**: Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000/api`

**Issue**: CORS errors
**Fix**: Backend should have CORS configured for `http://localhost:3000`

**Issue**: Protected route not redirecting
**Fix**: Check if component is marked with `'use client'` directive

## Next Steps

Now you can:
1. ✅ Add UserMenu to DashboardHeader
2. ✅ Create more protected pages
3. ✅ Build question bank features with authentication
4. ✅ Implement role-based permissions (Admin, Manager, User)
5. ✅ Add profile and settings pages

Happy coding! 🚀
