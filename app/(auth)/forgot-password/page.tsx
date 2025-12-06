'use client';

import { useState } from 'react';
import { usePasswordResetMutation } from '@/lib/redux/services/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [passwordReset, { isLoading }] = usePasswordResetMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      await passwordReset({ email }).unwrap();
      setIsSuccess(true);
      toast.success('Password reset link sent to your email!');
    } catch (error: any) {
      const errorMsg = error?.data?.email?.[0] || error?.data?.detail || 'Failed to send reset link. Please try again.';
      toast.error(errorMsg);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 text-center">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
              <p className="text-gray-600">
                We&apos;ve sent a password reset link to
              </p>
              <p className="text-purple-600 font-semibold">{email}</p>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-600">
              <p>Click the link in the email to reset your password.</p>
              <p>If you don&apos;t see the email, check your spam folder.</p>
            </div>

            {/* Back to Login */}
            <Link href="/login">
              <Button 
                className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>

            {/* Resend Link */}
            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail('');
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Didn&apos;t receive the email? Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {/* Back Button */}
          <Link 
            href="/login" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
            <p className="text-gray-600">
              No worries! Enter your email and we&apos;ll send you instructions to reset your password.
            </p>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="pl-12 h-14 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0 text-base"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          {/* Help Text */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Remember your password?{' '}
              <Link 
                href="/login" 
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
