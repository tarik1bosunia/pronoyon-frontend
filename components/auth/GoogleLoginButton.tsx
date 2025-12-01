// src/components/auth/GoogleLoginButton.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/redux/hooks';
import { useGoogleLoginMutation } from '@/lib/redux/services/authApi';
import { setCredentials } from '@/lib/redux/slices/authSlice';
import { toast } from 'sonner';
import { FcGoogle } from 'react-icons/fc'; // You'll need to install react-icons

interface GoogleLoginResponse {
  credential?: string; // ID Token
  // ... other fields
}

// Simulates the global Google object methods
declare global {
  interface Window {
    google: any;
  }
}

export function GoogleLoginButton({ onSuccessRedirect = '/' }: { onSuccessRedirect?: string }) {
  const dispatch = useAppDispatch();
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    // Load the Google Identity Services script dynamically or in _document.js
    // For this example, assume it's loaded in your main layout file or HTML head.
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
        // auto_select: true, // Optional: for auto sign-in
      });
      
      // Render the custom button instead of the default one-tap
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large', text: 'signin_with', width: '100%' }
      );
    }
  }, []);
  
  // Handles the response from Google's client-side flow
  const handleGoogleLogin = async (response: GoogleLoginResponse) => {
    if (!response.credential) {
      toast.error('Google login failed: No credential received.');
      return;
    }
    
    try {
      // Send the Google ID Token to your Django backend
      const result = await googleLogin({ access_token: response.credential }).unwrap();
      
      // Dispatch Redux action to save credentials
      dispatch(setCredentials(result));
      
      toast.success('Logged in with Google successfully!');
      // Assuming you have access to Next.js navigation (you may need `useRouter`)
      // For simplicity, let's keep it clean here.
      // router.push(onSuccessRedirect); 
      console.log('Redirecting to:', onSuccessRedirect); // Replace with router.push
      window.location.href = onSuccessRedirect; // Simple redirect for now
      
    } catch (err) {
      console.error('Django API Google login error:', err);
      toast.error('Failed to log in with Google via API.');
    }
  };

  // The actual button will be rendered by the Google SDK into this div
  return (
    <div id="googleSignInDiv" className="w-full">
      {/* Fallback button if Google SDK hasn't rendered yet */}
      {!isClient && (
        <Button 
          variant="outline" 
          className="w-full"
          disabled={isLoading}
        >
          <FcGoogle className="mr-2 h-4 w-4" /> Sign In with Google
        </Button>
      )}
    </div>
  );
}