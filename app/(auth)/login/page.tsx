'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoginMutation } from '@/lib/redux/services/authApi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setCredentials } from '@/lib/redux/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleLogin } from '@/components/auth/GoogleLogin';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  
  const redirectTo = searchParams.get('redirect') || '/';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(formData).unwrap();
      dispatch(setCredentials(user));
      toast.success('Login successful');
      router.push(redirectTo);
    } catch (err: any) {
      toast.error(err?.data?.detail || 'Failed to login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Pronoyon</h1>
          </div>

          {/* Google Login */}
          <GoogleLogin />

          <div className="text-center text-sm text-gray-500">
            Easiest way to sign in - no password needed
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500 font-medium">OR</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-12 h-14 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0 text-base"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-12 pr-12 h-14 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-center">
              <Link 
                href="/forgot-password" 
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base shadow-lg"
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </Button>
          </form>

          {/* Need Help */}
          <div className="text-center">
            <button className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm">
              <HelpCircle className="h-4 w-4" />
              <span>Need Help?</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Don&apos;t have an account?{' '}
              <Link 
                href="/register" 
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}