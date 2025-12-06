'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useGoogleLoginMutation } from '@/lib/redux/services/authApi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setCredentials } from '@/lib/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function GoogleLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [googleAuthApi, { isLoading }] = useGoogleLoginMutation();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Send the access token to Django to verify and get JWT
        const res = await googleAuthApi({ 
            auth_token: tokenResponse.access_token 
        }).unwrap();

        dispatch(setCredentials(res));
        toast.success('Logged in with Google!');
        router.push('/');
      } catch (error: any) {
        console.error('Google Login Error:', error);
        const errorMsg = error.data?.detail || 'Google login failed';
        toast.error(errorMsg);
      }
    },
    onError: () => {
      toast.error('Google login popup failed');
    }
  });

  return (
    <Button 
      variant="outline" 
      type="button" 
      className="w-full h-14 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
      onClick={() => login()}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-3 h-5 w-5 animate-spin text-gray-600" />
          <span className="text-base font-medium text-gray-700">Signing in...</span>
        </>
      ) : (
        <>
          <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-base font-semibold text-gray-800">Continue with Google</span>
        </>
      )}
    </Button>
  );
}