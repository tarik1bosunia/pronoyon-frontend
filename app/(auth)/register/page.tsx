'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegisterMutation } from '@/lib/redux/services/authApi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setCredentials } from '@/lib/redux/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleLogin } from '@/components/auth/GoogleLogin';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password1: '',
    password2: '',
    first_name: '',
    last_name: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password1) {
      newErrors.password1 = 'Password is required';
    } else if (formData.password1.length < 8) {
      newErrors.password1 = 'Password must be at least 8 characters';
    }

    if (formData.password1 !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await register(formData).unwrap();
      
      // Save credentials to Redux store (and localStorage via reducer)
      dispatch(setCredentials({
        user: result.user,
        access: result.access,
        refresh: result.refresh,
      }));

      toast.success('Registration successful! Welcome to Pronoyon!');
      router.push('/questions');
    } catch (error) {
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as { data?: Record<string, string | string[]> };
        // Handle field-specific errors
        if (apiError.data && typeof apiError.data === 'object') {
          const apiErrors: Record<string, string> = {};
          
          Object.keys(apiError.data).forEach(key => {
            const value = apiError.data![key];
            if (Array.isArray(value)) {
              apiErrors[key] = value[0];
            } else if (typeof value === 'string') {
              apiErrors[key] = value;
            }
          });
          
          setErrors(apiErrors);
          
          // Show toast for first error
          const firstError = Object.values(apiErrors)[0];
          if (firstError) {
            toast.error(firstError);
          }
        } else {
          toast.error('Registration failed. Please try again.');
        }
      } else {
        toast.error('Network error. Please try again.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500">Join Pronoyon and start your journey</p>
          </div>

          {/* Google Sign Up */}
          <GoogleLogin />

          <div className="text-center text-sm text-gray-500">
            Quick sign up with your Google account
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0"
                  />
                </div>
                {errors.first_name && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{errors.first_name}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0"
                  />
                </div>
                {errors.last_name && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="pl-12 h-14 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0 text-base"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
                <Input
                  id="password1"
                  name="password1"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password1}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
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
              {errors.password1 && (
                <p className="text-xs text-red-500 mt-1 ml-1">{errors.password1}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
                <Input
                  id="password2"
                  name="password2"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="pl-12 pr-12 h-14 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-0 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password2 && (
                <p className="text-xs text-red-500 mt-1 ml-1">{errors.password2}</p>
              )}
            </div>

            {/* Sign Up Button */}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base shadow-lg mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
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
