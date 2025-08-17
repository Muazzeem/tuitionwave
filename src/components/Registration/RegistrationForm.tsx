
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, Lock, Mail, Phone } from 'lucide-react';
import { RegistrationData } from '@/types/common';
import GoogleLoginButton from '../GoogleLoginButton';
import { setAuthTokens } from '@/utils/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => void;
  initialData?: RegistrationData;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, initialData }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchProfile, userProfile } = useAuth();
  const [formData, setFormData] = useState<RegistrationData>(initialData || {
    email: '',
    phone: '',
    password1: '',
    password2: '',
  });

  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Basic validation
    if (!formData.email || !formData.phone || !formData.password1 || !formData.password2) {
      alert('Please fill in all fields');
      setLoading(false);
      return;
    }
    
    if (formData.password1 !== formData.password2) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      alert('Please accept the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (userData: any) => {
      try {
        // Save tokens from Google login response
        setAuthTokens(userData);
        
        // Fetch user profile after successful Google login
        await fetchProfile();
        
        toast({
          title: "Google Login Success",
          description: "Successfully logged in with Google!",
        });
        
        // Navigate based on user type
        navigate('/dashboard');
      } catch (error) {
        toast({
          title: "Login Failed",
          description: "Failed to complete Google login process.",
          variant: "destructive",
        });
      }
    };


  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Signup</h2>
      <p className="text-gray-500 mb-6 dark:text-gray-400">Let's create your account!</p>

      <div className="mb-6">
        <GoogleLoginButton
                  onSuccess={handleGoogleLoginSuccess}
                  disabled={loading}
                />
              </div>
              
              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500 dark:bg-background dark:text-gray-400">Or continue with email</span>
                </div>
              </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                className="pl-10 bg-gray-900"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone Number"
                className="pl-10 bg-gray-900"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="password1">Password</Label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="password1"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                name="password1"
                value={formData.password1}
                onChange={handleChange}
                required
                className="pl-10 bg-gray-900"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="password2">Confirm Password</Label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="password2"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                className="pl-10 bg-gray-900"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              required
            />
            <Label htmlFor="terms" className="text-sm">
              By creating an account means you agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:underline">
                Terms & Conditions
              </Link>{' '}
              and our{' '}
              <Link to="/privacy" className="text-primary-600 hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full min-h-[55px] bg-primary hover:bg-primary-700 dark:text-white shadow-xl text-md"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        
          <div className="text-center mt-4 text-md">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <Link to="/" className="text-blue-600 hover:underline font-medium">
          Back
        </Link>
      </div>
    </>
  );
};

export default RegistrationForm;
