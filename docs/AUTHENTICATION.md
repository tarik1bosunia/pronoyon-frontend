# Authentication Setup with RTK Query

This document describes the authentication implementation in the Pronoyon frontend using Redux Toolkit (RTK) Query.

## Overview

The authentication system uses:
- **Redux Toolkit Query** for API calls
- **JWT tokens** for authentication (access + refresh)
- **Local Storage** for token persistence
- **Protected Routes** for secure pages

## Structure

```
lib/
├── redux/
│   ├── store.ts              # Redux store configuration
│   ├── hooks.ts              # Typed Redux hooks
│   ├── services/
│   │   └── authApi.ts        # RTK Query API endpoints
│   └── slices/
│       └── authSlice.ts      # Auth state management
└── providers/
    └── ReduxProvider.tsx     # Redux provider wrapper

app/
├── auth/
│   ├── login/
│   │   └── page.tsx          # Login page
│   └── register/
│       └── page.tsx          # Register page

components/
└── auth/
    ├── ProtectedRoute.tsx    # Protected route wrapper
    ├── UserMenu.tsx          # User dropdown menu
    └── index.ts              # Exports

types/
└── auth/
    └── index.ts              # TypeScript interfaces
```

## API Endpoints

### Base URL
```
http://localhost:8000/api
```

### Available Endpoints

1. **Register**
   - POST `/auth/registration/`
   - Body: `{ email, password1, password2, first_name?, last_name? }`
   - Returns: `{ access, refresh, user }`

2. **Login**
   - POST `/auth/login/`
   - Body: `{ email, password }`
   - Returns: `{ access, refresh, user }`

3. **Logout**
   - POST `/auth/logout/`
   - Requires: Bearer token
   - Returns: `void`

4. **Refresh Token**
   - POST `/auth/token/refresh/`
   - Body: `{ refresh }`
   - Returns: `{ access }`

## Usage

### 1. Login

```tsx
import { useLoginMutation } from '@/lib/redux/services/authApi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setCredentials } from '@/lib/redux/slices/authSlice';

const [login, { isLoading }] = useLoginMutation();
const dispatch = useAppDispatch();

const handleLogin = async () => {
  const result = await login({ email, password }).unwrap();
  dispatch(setCredentials(result));
};
```

### 2. Register

```tsx
import { useRegisterMutation } from '@/lib/redux/services/authApi';

const [register, { isLoading }] = useRegisterMutation();

const handleRegister = async () => {
  const result = await register({
    email,
    password1,
    password2,
    first_name,
    last_name
  }).unwrap();
  dispatch(setCredentials(result));
};
```

### 3. Access User State

```tsx
import { useAppSelector } from '@/lib/redux/hooks';

const { user, isAuthenticated } = useAppSelector((state) => state.auth);
```

### 4. Protect Routes

```tsx
import { ProtectedRoute } from '@/components/auth';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <YourContent />
    </ProtectedRoute>
  );
}
```

### 5. User Menu Component

```tsx
import { UserMenu } from '@/components/auth';

<UserMenu />
```

## State Management

### Auth Slice State

```typescript
{
  user: User | null;
  access: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
}
```

### Actions

- `setCredentials({ user, access, refresh })` - Save auth data
- `updateAccessToken(access)` - Update access token only
- `logout()` - Clear all auth data

## Local Storage

The auth state is automatically persisted to localStorage:

- `access_token` - JWT access token
- `refresh_token` - JWT refresh token
- `user` - User object (JSON)

State is restored on page load if tokens exist.

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Features

✅ JWT-based authentication
✅ Automatic token persistence
✅ Protected route wrapper
✅ User dropdown menu
✅ Login/Register pages with validation
✅ Error handling with toast notifications
✅ Loading states
✅ Auto-redirect for authenticated users
✅ TypeScript support

## Next Steps

- [ ] Implement token refresh logic
- [ ] Add password reset functionality
- [ ] Add email verification
- [ ] Add social authentication (Google OAuth)
- [ ] Add role-based permissions
- [ ] Add user profile page
- [ ] Add account settings page

## Testing

1. Start the backend: `docker compose up`
2. Start the frontend: `npm run dev`
3. Navigate to `http://localhost:3000`
4. Click "Get Started" → redirects to login
5. Register a new account
6. Login with credentials
7. Access protected `/questions` page

## Troubleshooting

### "Network error" on login/register
- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### Protected route not working
- Check if tokens exist in localStorage
- Verify `isAuthenticated` state in Redux DevTools
- Check console for errors

### User data not persisting
- Check localStorage in browser DevTools
- Verify `ReduxProvider` wraps the app in `layout.tsx`
