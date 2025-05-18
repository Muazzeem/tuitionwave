import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { setAuthTokens } from '@/utils/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { fetchProfile, userProfile } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<'tutor' | 'guardian' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Check if we're already logged in and redirect if needed
  useEffect(() => {
    if (userProfile) {
      if (userProfile.user_type === 'TEACHER') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/guardian/dashboard');
      }
    }
  }, [userProfile, navigate]);

  // Handle user type selection and automatically advance to step 2
  const handleUserTypeChange = (value: 'tutor' | 'guardian') => {
    setUserType(value);
    // Add a small delay for better UX
    setTimeout(() => {
      setStep(2);
    }, 300);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      // Save tokens with expiration timestamp
      setAuthTokens(data);
      
      // Fetch user profile after successful login
      await fetchProfile();
      
      toast({
        title: "Login Success",
        description: "Successfully logged in!",
      });
      
      // Navigate based on user type
      if (userType === 'tutor') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/guardian/dashboard');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Login failed. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left section with image */}
      <div className="hidden md:flex md:w-1/2 bg-gray-600 relative">
        <img 
          src="/lovable-uploads/56c05a63-4266-4a9d-ad96-7c9d83120840.png" 
          alt="Mother and child studying" 
          className="w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Logo */}
        <div className="absolute top-6 left-6">
          <Link to={'/'}>
            <h1 className="text-2xl font-bold text-white">Tuition Wave</h1>
          </Link>
        </div>
        
        {/* Welcome message */}
        <div className="absolute bottom-20 left-10 text-white">
          <h2 className="text-3xl font-bold mb-1">Welcome Back!</h2>
          <p className="text-sm">Manage Your Perfect Tuition Effortlessly</p>
        </div>
      </div>

      {/* Right section with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {step === 1 ? (
            <div className="bg-white rounded-lg p-6 shadow-sm border dark:bg-gray-900">
              <h2 className="text-2xl font-bold text-center mb-6">Choose Your Login Type</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Teacher Card */}
                <div 
                  className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 dark:border-gray-700 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
                  onClick={() => handleUserTypeChange('tutor')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-blue-900">
                      <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Teacher</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Access your teaching dashboard and manage your classes</p>
                  </div>
                </div>

                {/* Guardian Card */}
                <div 
                  className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 dark:border-gray-700 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
                  onClick={() => handleUserTypeChange('guardian')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-green-900">
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Guardian</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Monitor your child's progress and manage tuition</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 shadow-sm border dark:bg-gray-900">
              <h2 className="text-2xl font-bold mb-2">Log in to {userType === 'tutor' ? 'Teacher' : 'Guardian'} Panel</h2>
              <p className="text-gray-500 mb-6 dark:text-gray-400">Welcome! Please enter your email and password.</p>
              
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pr-10"
                        disabled={loading}
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
                  
                  <Button 
                    type="submit" 
                    className="w-full min-h-[55px] bg-blue-600 hover:bg-blue-700 mt-2 dark:text-white"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Log in'}
                  </Button>
                  
                  <div className="text-center text-sm">
                    <div className="text-center mt-4 text-sm">
                      Don't have an account? <Link to="/auth/registration" className="text-blue-600 hover:underline font-medium">Sign Up</Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;